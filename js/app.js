document.addEventListener("DOMContentLoaded", function () {

  console.log("APP VERSION 10 - GOOGLE FORMS POST");

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
  // ENVIAR GOOGLE FORMS
  // =====================================================

  function enviarAGoogleForms(datos) {

    return new Promise(function (resolve) {

      const iframe =
        document.createElement("iframe");

      const targetName =
        "googleFormsTarget_" + Date.now();


      iframe.name =
        targetName;

      iframe.style.display =
        "none";


      document.body.appendChild(
        iframe
      );


      const googleForm =
        document.createElement("form");


      googleForm.method =
        "POST";

      googleForm.action =
        CONFIG.googleForm.url;

      googleForm.target =
        targetName;

      googleForm.style.display =
        "none";


      Object.entries(datos)
        .forEach(function ([campo, valor]) {

          const input =
            document.createElement("input");

          input.type =
            "hidden";

          input.name =
            campo;

          input.value =
            valor;

          googleForm.appendChild(
            input
          );

        });


      document.body.appendChild(
        googleForm
      );


      let enviado = false;


      iframe.addEventListener(
        "load",
        function () {

          if (enviado) {

            setTimeout(
              function () {

                googleForm.remove();
                iframe.remove();

              },
              1000
            );


            resolve();
          }

        }
      );


      enviado = true;

      googleForm.submit();


      // Fallback:
      // Google puede bloquear lectura del iframe,
      // pero el POST igualmente se realiza.

      setTimeout(
        function () {

          if (
            document.body.contains(
              googleForm
            )
          ) {

            googleForm.remove();
          }


          if (
            document.body.contains(
              iframe
            )
          ) {

            iframe.remove();
          }


          resolve();

        },
        1800
      );

    });
  }


  // =====================================================
  // SUBMIT PRINCIPAL
  // =====================================================

  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (!form.checkValidity()) {

        form.reportValidity();

        return;
      }


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


      // =====================================================
      // LEER DATOS
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


      const segundoAdulto =
        cantidadAdultos === "2"
          ? adulto2.value.trim()
          : "NO";


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
      // DATOS GOOGLE FORM
      // =====================================================

      const datosGoogle = {

        [CONFIG.googleForm.fields.fecha]:
          fechaRegistro,

        [CONFIG.googleForm.fields.nino]:
          nino,

        [CONFIG.googleForm.fields.adulto1]:
          adulto1,

        [CONFIG.googleForm.fields.adultos]:
          cantidadAdultos,

        [CONFIG.googleForm.fields.adulto2]:
          segundoAdulto,

        [CONFIG.googleForm.fields.comentario]:
          comentario,

        [CONFIG.googleForm.fields.origen]:
          "WEB"

      };


      console.log(
        "Datos que enviaremos a Google:",
        datosGoogle
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


      boton.disabled =
        true;


      boton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i>' +
        '<span>Registrando...</span>';


      // =====================================================
      // GOOGLE FORMS
      // =====================================================

      try {

        await enviarAGoogleForms(
          datosGoogle
        );

      } catch (error) {

        console.error(
          "Error Google Forms:",
          error
        );


        boton.disabled =
          false;


        boton.innerHTML =
          contenidoOriginal;


        alert(
          "No pudimos registrar la asistencia."
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


      boton.disabled =
        false;


      boton.innerHTML =
        contenidoOriginal;


      window.location.href =
        whatsappURL;

    }
  );

});
