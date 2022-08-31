
//base_layout.html

function menuResponsiveness() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

//fotos.html
  var ocr = function(event) {
    event.preventDefault();
    //document.getElementById('dimmer').innerHTML = ['<div class="dimmer" id="dimmer"></div>']
    document.getElementById('loader').innerHTML = ['<div class="loader" id="loader"></div>']
    if(!document.getElementById('imgde') || !document.getElementById('imgen')) {
        if(!document.getElementById('imgde')) {
            var alerttxt = "Es wurde kein Foto der deutschen Vokabeln hochgeladen."
        }
        if(!document.getElementById('imgen')) {
            var alerttxt = "Es wurde kein Foto der englischen Vokabeln hochgeladen."
        }
        if(!document.getElementById('imgde') & !document.getElementById('imgen')) {
            var alerttxt = "Es wurden keine Fotos hochgeladen."
        }
        alert(alerttxt)
        window.location = "/abfrage/fotos"
    }
    else {
    
    Tesseract.recognize(
        document.getElementById('imgde').src,
        'deu', {
            logger: m => console.log(m)
        }
    ).then(({
        data: {
            text
        }
    }) => {
        console.log(text);
        Tesseract2(text);
    })
    }
};

function Tesseract2(text_de) {
Tesseract.recognize(
    document.getElementById('imgen').src,
    'eng', {
        logger: m => console.log(m)
    }
).then(({
    data: {
        text
    }
}) => {
    console.log(text);
    AjaxCall(text_de, text);
})

}

function AjaxCall(text_de, text_en) {
$.ajax({
    type: 'POST',
    url: "/abfrage/korrektur/",
    data: {
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), // to avois csrf error
        txt_voc_en: text_en,
        txt_voc_de: text_de
    },
    success: function(json) {
        console.log("success");
        window.location = "/abfrage/korrektur/"
    },
    error: function(xhr, errmsg, err) {
        console.log(xhr.status + ": " + xhr.responseText);
    }
});
}
