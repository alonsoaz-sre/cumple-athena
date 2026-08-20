document.addEventListener("DOMContentLoaded", function () {

  console.log("APP VERSION 11 - GOOGLE FORMS OK");

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
  // SEGUNDO ADULTO
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


  actualizarSegundoAdulto();


  // =====================================================
  // FECHA LOCAL
  // =====================================================

  function obtenerFechaLocal() {

    const ahora = new Date();

    const yyyy =
      ahora.getFullYear();

    const mm =
      String(
        ahora.getMonth() + 1
      ).padStart(2, "0");

    const dd =
      String(
        ahora.getDate()
      ).padStart(2, "0");


    return `${yyyy}-${mm}-${dd}`;
  }


  // =====================================================
  // SUBMIT
  // =====================================================

  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      // -------------------------------------------------
      // VALIDACIÓN HTML
      // -------------------------------------------------

      if (!form.checkValidity()) {

        form.reportValidity();

        return;
      }


      // -------------------------------------------------
      // CONFIG
      // -------------------------------------------------

      if (
        typeof CONFIG === "undefined" ||
        !CONFIG.googleForm ||
        !CONFIG.googleForm.url ||
        !CONFIG.googleForm.fields
      ) {

        alert(
          "No está configurado Google Forms."
        );

        return;
      }


      if (!CONFIG.whatsapp) {

        alert(
          "No está configurado WhatsApp."
        );

        return;
      }


      // =====================================================
      // DATOS
      // =====================================================

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


      // Adulto 2:
      // Google Forms siempre recibe un valor.

      const segundoAdulto =
        cantidadAdultos === "2"
          ? adulto2.value.trim()
          : "NO";


      // Comentario:
      // Google Forms siempre recibe un valor.

      const comentarioIngresado =
        document
          .getElementById("comentario")
          .value
          .trim();


      const comentario =
        comentarioIngresado !== ""
          ? comentarioIngresado
          : "NO";


      const fechaRegistro =
        obtenerFechaLocal();


      // =====================================================
      // GOOGLE FORM
      // =====================================================

      const datosGoogle =
        new FormData();


      datosGoogle.append(
        CONFIG.googleForm.fields.fecha,
        fechaRegistro
      );


      datosGoogle.append(
        CONFIG.googleForm.fields.nino,
        nino
      );


      datosGoogle.append(
        CONFIG.googleForm.fields.adulto1,
        adulto1
      );


      datosGoogle.append(
        CONFIG.googleForm.fields.adultos,
        cantidadAdultos
      );


      datosGoogle.append(
        CONFIG.googleForm.fields.adulto2,
        segundoAdulto
      );


      datosGoogle.append(
        CONFIG.googleForm.fields.comentario,
        comentario
      );


      datosGoogle.append(
        CONFIG.googleForm.fields.origen,
        "WEB"
      );


      // =====================================================
      // BOTÓN
      // =====================================================

      const boton =
        form.querySelector(
          'button[type="submit"]'
        );


      const contenidoOriginal =
        boton.innerHTML;


      boton.disabled = true;


      boton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i>' +
        '<span>Registrando...</span>';


      // =====================================================
      // ENVÍO GOOGLE FORMS
      // =====================================================

      try {

        await fetch(
          CONFIG.googleForm.url,
          {
            method: "POST",
            mode: "no-cors",
            body: datosGoogle
          }
        );


        console.log(
          "Registro enviado a Google Forms:",
          {
            fecha: fechaRegistro,
            nino: nino,
            adulto1: adulto1,
            adultos: cantidadAdultos,
            adulto2: segundoAdulto,
            comentario: comentario,
            origen: "WEB"
          }
        );


      } catch (error) {

        console.error(
          "Error al registrar:",
          error
        );


        boton.disabled = false;

        boton.innerHTML =
          contenidoOriginal;


        alert(
          "No pudimos registrar tu asistencia. Inténtalo nuevamente."
        );

        return;
      }


      // =====================================================
      // WHATSAPP
      // =====================================================

      let mensaje =
        "*CONFIRMACIÓN CUMPLEAÑOS ATHENA*" +

        "\n\n" +

        "*Niño/a invitado:*" +
        "\n" +
        nino +

        "\n\n" +

        "*Adulto responsable:*" +
        "\n" +
        adulto1 +

        "\n\n" +

        "*Adultos asistentes:*" +
        "\n" +
        cantidadAdultos;


      if (cantidadAdultos === "2") {

        mensaje +=
          "\n\n" +

          "*Segundo adulto:*" +
          "\n" +
          segundoAdulto;
      }


      if (comentario !== "NO") {

        mensaje +=
          "\n\n" +

          "*Comentario:*" +
          "\n" +
          comentario;
      }


      mensaje +=
        "\n\n" +
        "*Confirmamos nuestra asistencia*";


      const whatsappURL =
        "https://wa.me/" +
        CONFIG.whatsapp +
        "?text=" +
        encodeURIComponent(
          mensaje
        );


      // =====================================================
      // PEQUEÑA ESPERA
      // =====================================================

      /*
       * Damos un momento al navegador para que despache
       * el POST antes de navegar hacia WhatsApp.
       */

      setTimeout(
        function () {

          boton.disabled = false;

          boton.innerHTML =
            contenidoOriginal;


          window.location.href =
            whatsappURL;

        },
        700
      );

    }
  );

});
