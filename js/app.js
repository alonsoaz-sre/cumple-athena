document.addEventListener("DOMContentLoaded", function () {

  console.log("APP VERSION 6 - EMOJIS CON fromCodePoint");

  const form = document.getElementById("formAsistencia");
  const adulto2Container = document.getElementById("adulto2Container");
  const adulto2 = document.getElementById("adulto2");

  const opcionesAdultos =
    document.querySelectorAll('input[name="adultos"]');


  // Emojis construidos por código Unicode
  // Así evitamos problemas de encoding en el archivo JS.
  const pastel = String.fromCodePoint(0x1F382);      // 🎂
  const ninoIcon = String.fromCodePoint(0x1F9D2);    // 🧒
  const persona = String.fromCodePoint(0x1F464);     // 👤
  const grupo = String.fromCodePoint(0x1F465);       // 👥
  const comentarioIcon = String.fromCodePoint(0x1F4AC); // 💬
  const check = String.fromCodePoint(0x2705);         // ✅


  function actualizarSegundoAdulto() {

    const seleccion =
      document.querySelector(
        'input[name="adultos"]:checked'
      );

    if (!seleccion) {
      return;
    }


    if (seleccion.value === "2") {

      adulto2Container.classList.remove("hidden");

      adulto2.required = true;

    } else {

      adulto2Container.classList.add("hidden");

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


  // Inicializa el estado al cargar la página
  actualizarSegundoAdulto();


  form.addEventListener("submit", function (event) {

    event.preventDefault();


    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }


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


    const cantidadAdultos =
      document.querySelector(
        'input[name="adultos"]:checked'
      ).value;


    const segundoAdulto =
      adulto2
        .value
        .trim();


    const comentario =
      document
        .getElementById("comentario")
        .value
        .trim();


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


    if (cantidadAdultos === "2") {

      mensaje +=
        "\n\n" +

        persona +
        " *Segundo adulto:*" +
        "\n" +
        segundoAdulto;

    }


    if (comentario !== "") {

      mensaje +=
        "\n\n" +

        comentarioIcon +
        " *Comentario:*" +
        "\n" +
        comentario;

    }


    mensaje +=
      "\n\n" +

      check +
      " *Confirmamos nuestra asistencia*";


    if (
      typeof CONFIG === "undefined" ||
      !CONFIG.whatsapp
    ) {

      alert(
        "No está configurado el número de WhatsApp."
      );

      return;

    }


    // El mensaje se codifica UNA SOLA VEZ aquí.
    const whatsappURL =
      "https://wa.me/" +
      CONFIG.whatsapp +
      "?text=" +
      encodeURIComponent(mensaje);


    console.log("Mensaje:", mensaje);
    console.log("URL WhatsApp:", whatsappURL);


    window.location.href = whatsappURL;

  });

});
