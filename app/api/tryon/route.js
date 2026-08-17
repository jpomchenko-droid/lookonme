export const runtime = "nodejs";
export const maxDuration = 300;

const BASE_URL = "https://api.fashn.ai/v1";

async function fileToDataUri(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mime = file.type || "image/jpeg";

  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function getErrorMessage(data, fallback) {
  if (typeof data?.error === "string") {
    return data.error;
  }

  if (data?.error?.message) {
    return data.error.message;
  }

  if (data?.message) {
    return data.message;
  }

  return fallback;
}

export async function POST(request) {
  try {
    const apiKey = process.env.FASHN_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error: "FASHN_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const formData = await request.formData();

    const person = formData.get("person");
    const clothes = formData.get("clothes");

    if (
      !person ||
      !clothes ||
      typeof person.arrayBuffer !== "function" ||
      typeof clothes.arrayBuffer !== "function"
    ) {
      return Response.json(
        {
          error: "Please upload both images.",
        },
        {
          status: 400,
        }
      );
    }

    const maxInputSize = 30 * 1024 * 1024;

    if (person.size > maxInputSize || clothes.size > maxInputSize) {
      return Response.json(
        {
          error: "Each image must be smaller than 30 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const modelImage = await fileToDataUri(person);
    const productImage = await fileToDataUri(clothes);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const runResponse = await fetch(`${BASE_URL}/run`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model_name: "tryon-max",
        inputs: {
          model_image: modelImage,
          product_image: productImage,
          resolution: "1k",
          generation_mode: "fast",
          num_images: 1,
          output_format: "jpeg",
        },
      }),
    });

    let runData;

    try {
      runData = await runResponse.json();
    } catch {
      return Response.json(
        {
          error: "FASHN returned an invalid response.",
        },
        {
          status: 502,
        }
      );
    }

    if (!runResponse.ok || !runData?.id) {
      return Response.json(
        {
          error: getErrorMessage(
            runData,
            "Could not start the virtual try-on."
          ),
        },
        {
          status: runResponse.status || 500,
        }
      );
    }

    const predictionId = runData.id;

    const startedAt = Date.now();
    const timeoutMs = 240000;

    while (Date.now() - startedAt < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await fetch(
        `${BASE_URL}/status/${predictionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          cache: "no-store",
        }
      );

      let statusData;

      try {
        statusData = await statusResponse.json();
      } catch {
        continue;
      }

      if (statusData?.status === "completed") {
        const result = statusData?.output?.[0];

        if (!result) {
          return Response.json(
            {
              error: "The AI completed the request but returned no image.",
            },
            {
              status: 502,
            }
          );
        }

        return Response.json({
          success: true,
          result,
          predictionId,
        });
      }

      if (
        ["starting", "in_queue", "processing"].includes(
          statusData?.status
        )
      ) {
        continue;
      }

      if (statusData?.status) {
        return Response.json(
          {
            error: getErrorMessage(
              statusData,
              `Virtual try-on failed: ${statusData.status}`
            ),
          },
          {
            status: 500,
          }
        );
      }
    }

    return Response.json(
      {
        error:
          "The AI is still processing the image. Please try again in a moment.",
      },
      {
        status: 504,
      }
    );
  } catch (error) {
    console.error("LOOKONME try-on error:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "An unexpected server error occurred.",
      },
      {
        status: 500,
      }
    );
  }
}
