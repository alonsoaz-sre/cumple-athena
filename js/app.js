const form = document.getElementById("formAsistencia");

const adulto2Container =
  document.getElementById("adulto2Container");

const adulto2 =
  document.getElementById("adulto2");

const opcionesAdultos =
  document.querySelectorAll(
    'input[name="adultos"]'
  );


opcionesAdultos.forEach(opcion => {

  opcion.addEventListener("change", () => {

    const cantidad =
      document.querySelector(
        'input[name="adultos"]:checked'
      ).value;

    if (cantidad === "2") {

      adulto2Container.classList.remove("hidden");

      adulto2.required = true;

    } else {

      adulto2Container.classList.add("hidden");

      adulto2.required = false;

      adulto2.value = "";

    }

  });

});


form.addEventListener("submit", function(event) {

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


  let mensaje = `🎂 CONFIRMACIÓN CUMPLEAÑOS ATHENA 🎂

🧒 Niño/a invitado:
${nino}

👤 Adulto responsable:
${adulto1}

👥 Adultos asistentes:
${cantidadAdultos}`;


  if (cantidadAdultos === "2") {

    mensaje += `

👤 Segundo adulto:
${segundoAdulto}`;

  }


  if (comentario) {

    mensaje += `

💬 Comentario:
${comentario}`;

  }


  mensaje += `

✅ Confirmamos nuestra asistencia`;


  const whatsappURL =
    `https://wa.me/${CONFIG.whatsapp}?text=` +🔥aa+
    encodeURIComponent(mensaje);


  window.location.href = whatsappURL;

});
