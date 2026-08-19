document.addEventListener("DOMContentLoaded", function () {

  console.log("APP VERSION 7 - WHATSAPP WEB");

  // =====================================================
  // ELEMENTOS DEL FORMULARIO
  // =====================================================

  const form =
    document.getElementById("formAsistencia");

  const adulto2Container =
    document.getElementById("adulto2Container");

  const adulto2 =
    document.getElementById("adulto2");

  const opcionesAdultos =
    document.querySelectorAll(
      'input[name="adultos"]'
    );


  // =====================================================
  // EMOJIS
  // =====================================================

  const pastel =
    String.fromCodePoint(0x1F382); // 🎂

  const ninoIcon =
    String.fromCodePoint(0x1F9D2); // 🧒

  const persona =
    String.fromCodePoint(0x1F464); // 👤

  const grupo =
    String.fromCodePoint(0x1F465); // 👥

  const comentarioIcon =
    String.fromCodePoint(0x1F4AC); // 💬

  const check =
    String.fromCodePoint(0x2705); // ✅


  // =====================================================
  // MOSTRAR / OCULTAR SEGUNDO ADULTO
  // =====================================================

  function actualizarSegundoAdulto() {

    const seleccion =
      document.querySelector(
        'input[name="adultos"]:checked'
      );

    if (!seleccion) {
      return;
    }


    if (seleccion.value === "2") {

      adulto2Container
        .classList
        .remove("hidden");

      adulto2.required = true;

    } else {

      adulto2Container
        .classList
        .add("hidden");

      adulto2.required = false;

      adulto2.value = "";

    }

  }


  opcionesAdultos.forEach(function (opcion) {

    opcion.addEventListener(
      "change",
      actualizarSegundoAdulto
    );

  });


  // Estado inicial
  actualizarSegundoAdulto();


  // =====================================================
  // ENVÍO DEL FORMULARIO
  // =====================================================

  form.addEventListener("submit", function (event) {

    event.preventDefault();


    // ---------------------------------------------------
    // VALIDACIÓN HTML
    // ---------------------------------------------------

    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }


    // ---------------------------------------------------
    // OBTENER DATOS
    // ---------------------------------------------------

    const nino =
      document
        .getElementById("nino")
        .value
        .trim();


    const adulto1 =
      document
        .getElementById("adulto1")
        .value
        .trim();


    const seleccionAdultos =
      document.querySelector(
        'input[name="adultos"]:checked'
      );


    if (!seleccionAdultos) {

      alert(
        "Selecciona la cantidad de adultos."
      );

      return;

    }


    const cantidadAdultos =
      seleccionAdultos.value;


    const segundoAdulto =
      adulto2
        .value
        .trim();


    const comentario =
      document
        .getElementById("comentario")
        .value
        .trim();


    // ---------------------------------------------------
    // CONSTRUIR MENSAJE
    // ---------------------------------------------------

    let mensaje =
      pastel +
      " *CONFIRMACIÓN CUMPLEAÑOS ATHENA* " +
      pastel +

      "\n\n" +

      ninoIcon +
      " *Niño/a invitado:*" +
      "\n" +
      nino +

      "\n\n" +

      persona +
      " *Adulto responsable:*" +
      "\n" +
      adulto1 +

      "\n\n" +

      grupo +
      " *Adultos asistentes:*" +
      "\n" +
      cantidadAdultos;


    // ---------------------------------------------------
    // SEGUNDO ADULTO
    // ---------------------------------------------------

    if (cantidadAdultos === "2") {

      mensaje +=
        "\n\n" +

        persona +
        " *Segundo adulto:*" +
        "\n" +
        segundoAdulto;

    }


    // ---------------------------------------------------
    // COMENTARIO
    // ---------------------------------------------------

    if (comentario !== "") {

      mensaje +=
        "\n\n" +

        comentarioIcon +
        " *Comentario:*" +
        "\n" +
        comentario;

    }


    // ---------------------------------------------------
    // CIERRE
    // ---------------------------------------------------

    mensaje +=
      "\n\n" +

      check +
      " *Confirmamos nuestra asistencia*";


    // =====================================================
    // VALIDAR CONFIGURACIÓN
    // =====================================================

    if (
      typeof CONFIG === "undefined" ||
      !CONFIG.whatsapp
    ) {

      alert(
        "No está configurado el número de WhatsApp."
      );

      return;

    }


    // =====================================================
    // CREAR URL
    // =====================================================

    const whatsappURL =
      "https://web.whatsapp.com/send" +
      "?phone=" +
      CONFIG.whatsapp +
      "&text=" +
      encodeURIComponent(mensaje);


    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      "Mensaje generado:",
      mensaje
    );

    console.log(
      "URL WhatsApp:",
      whatsappURL
    );


    // =====================================================
    // ABRIR WHATSAPP
    // =====================================================

    window.location.href =
      whatsappURL;

  });

});
