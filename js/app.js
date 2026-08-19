document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("formAsistencia");
  const adulto2Container = document.getElementById("adulto2Container");
  const adulto2 = document.getElementById("adulto2");

  const opcionesAdultos =
    document.querySelectorAll('input[name="adultos"]');


  function actualizarSegundoAdulto() {

    const seleccion =
      document.querySelector(
        'input[name="adultos"]:checked'
      );

    if (!seleccion) return;

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


  actualizarSegundoAdulto();


  form.addEventListener("submit", function (event) {

    event.preventDefault();


    if (!form.checkValidity()) {

      form.reportValidity();
      return;

    }


    const nino =
      document.getElementById("nino")
        .value
        .trim();

    const adulto1 =
      document.getElementById("adulto1")
        .value
        .trim();

    const cantidadAdultos =
      document.querySelector(
        'input[name="adultos"]:checked'
      ).value;

    const segundoAdulto =
      adulto2.value.trim();

    const comentario =
      document.getElementById("comentario")
        .value
        .trim();


    let mensaje =
      "🎂 CONFIRMACIÓN CUMPLEAÑOS ATHENA 🎂\n\n" +
      "🧒 Niño/a invitado:\n" +
      nino +
      "\n\n" +
      "👤 Adulto responsable:\n" +
      adulto1 +
      "\n\n" +
      "👥 Adultos asistentes:\n" +
      cantidadAdultos;


    if (cantidadAdultos === "2") {

      mensaje +=
        "\n\n👤 Segundo adulto:\n" +
        segundoAdulto;

    }


    if (comentario !== "") {

      mensaje +=
        "\n\n💬 Comentario:\n" +
        comentario;

    }


    mensaje +=
      "\n\n✅ Confirmamos nuestra asistencia";


    if (
      typeof CONFIG === "undefined" ||
      !CONFIG.whatsapp
    ) {

      alert(
        "No está configurado el número de WhatsApp."
      );

      return;

    }


    const whatsappURL =
      "https://wa.me/" +
      CONFIG.whatsapp +
      "?text=" +a+
      encodeURIComponent(mensaje);


    window.location.href = whatsappURL;

  });

});
