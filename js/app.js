document.addEventListener("DOMContentLoaded", function () {

  console.log("APP VERSION 9 - GOOGLE FORM + WHATSAPP");

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


  actualizarSegundoAdulto();


  // =====================================================
  // FECHA Y HORA LOCAL
  // =====================================================

  function obtenerFechaHora() {

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

    const hh =
      String(
        ahora.getHours()
      ).padStart(2, "0");

    const min =
      String(
        ahora.getMinutes()
      ).padStart(2, "0");


    return {

      fecha:
        `${yyyy}-${mm}-${dd}`,

      hora:
        `${hh}:${min}`

    };
  }


  // =====================================================
  // SUBMIT
  // =====================================================

  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      // -------------------------------------------------
      // VALIDAR FORMULARIO HTML
      // -------------------------------------------------

      if (!form.checkValidity()) {

        form.reportValidity();

        return;
      }


      // -------------------------------------------------
      // VALIDAR CONFIG
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
          "No está configurado el número de WhatsApp."
        );

        return;
      }


      // =====================================================
      // OBTENER DATOS
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


      // =====================================================
      // ADULTO 2
      // =====================================================

      const segundoAdulto =
        cantidadAdultos === "2"
          ? adulto2.value.trim()
          : "NO";


      // =====================================================
      // COMENTARIO
      // =====================================================

      const comentarioIngresado =
        document
          .getElementById("comentario")
          .value
          .trim();


      const comentario =
        comentarioIngresado !== ""
          ? comentarioIngresado
          : "NO";


      // =====================================================
      // FECHA / HORA
      // =====================================================

      const fechaHora =
        obtenerFechaHora();


      // =====================================================
      // PREPARAR GOOGLE FORMS
      // =====================================================

      const datosGoogle =
        new FormData();


      datosGoogle.append(
        CONFIG.googleForm.fields.fecha,
        fechaHora.fecha
      );


      datosGoogle.append(
        CONFIG.googleForm.fields.hora,
        fechaHora.hora
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
      // BOTÓN: ESTADO REGISTRANDO
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
      // ENVIAR A GOOGLE FORMS
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
          "Registro enviado a Google Forms"
        );


      } catch (error) {

        console.error(
          "Error al enviar a Google Forms:",
          error
        );


        boton.disabled = false;

        boton.innerHTML =
          contenidoOriginal;


        alert(
          "No pudimos registrar la asistencia. Inténtalo nuevamente."
        );


        return;
      }


      // =====================================================
      // CONSTRUIR MENSAJE DE WHATSAPP
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


      // -------------------------------------------------
      // SEGUNDO ADULTO SOLO SI EXISTE
      // -------------------------------------------------

      if (cantidadAdultos === "2") {

        mensaje +=
          "\n\n" +

          "*Segundo adulto:*" +
          "\n" +
          segundoAdulto;
      }


      // -------------------------------------------------
      // COMENTARIO SOLO SI EL USUARIO ESCRIBIÓ UNO
      // -------------------------------------------------

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


      // =====================================================
      // URL WHATSAPP
      // =====================================================

      const whatsappURL =
        "https://web.whatsapp.com/send" +
        "?phone=" +
        CONFIG.whatsapp +
        "&text=" +
        encodeURIComponent(mensaje);


      console.log(
        "Datos enviados:",
        {
          fecha: fechaHora.fecha,
          hora: fechaHora.hora,
          nino: nino,
          adulto1: adulto1,
          adultos: cantidadAdultos,
          adulto2: segundoAdulto,
          comentario: comentario,
          origen: "WEB"
        }
      );


      // =====================================================
      // RESTAURAR BOTÓN
      // =====================================================

      boton.disabled = false;

      boton.innerHTML =
        contenidoOriginal;


      // =====================================================
      // ABRIR WHATSAPP
      // =====================================================

      window.location.href =
        whatsappURL;

    }
  );

});
