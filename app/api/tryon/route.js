export async function POST(request) {
  try {
    const formData = await request.formData();

    const person = formData.get("person");
    const clothes = formData.get("clothes");

    if (!person || !clothes) {
      return Response.json(
        { error: "Загрузите фото человека и одежды" },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Фото получены. API виртуальной примерки готов к подключению."
    });

  } catch (error) {
    return Response.json(
      { error: "Ошибка обработки запроса" },
      { status: 500 }
    );
  }
}
