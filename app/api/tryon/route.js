export const runtime = "nodejs";
export const maxDuration = 60;

const BASE_URL = "https://api.fashn.ai/v1";

async function fileToDataUri(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mime = file.type || "image/jpeg";

  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function POST(request) {
  try {
    const apiKey = process.env.FASHN_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "FASHN_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const person = formData.get("person");
    const clothes = formData.get("clothes");

    if (!person || !clothes) {
      return Response.json(
        { error: "Загрузите фото человека и фото одежды" },
        { status: 400 }
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

    const runData = await runResponse.json();

    if (!runResponse.ok || !runData.id) {
      return Response.json(
        {
          error:
            runData?.error?.message ||
            runData?.error ||
            "Не удалось запустить AI-примерку",
        },
        { status: runResponse.status || 500 }
      );
    }

    const predictionId = runData.id;

    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await fetch(
        `${BASE_URL}/status/${predictionId}`,
        { headers }
      );

      const statusData = await statusResponse.json();

      if (statusData.status === "completed") {
        return Response.json({
          success: true,
          result: statusData.output?.[0],
        });
      }

      if (
        !["starting", "in_queue", "processing"].includes(
          statusData.status
        )
      ) {
        return Response.json(
          {
            error:
              statusData?.error?.message ||
              statusData?.error ||
              "AI-примерка завершилась с ошибкой",
          },
          { status: 500 }
        );
      }
    }

    return Response.json(
      { error: "Примерка занимает слишком много времени. Попробуйте ещё раз." },
      { status: 504 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message || "Ошибка сервера" },
      { status: 500 }
    );
  }
}
