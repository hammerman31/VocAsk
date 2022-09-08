
//base-layout.html

function menuResponsiveness() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
  
//foto-upload.html
async function submitFotos(event) {
    event.preventDefault();
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
        let de_text = await ocrTransformer('deu', 'imgde')
        console.log(de_text)
        let en_text = await ocrTransformer('eng', 'imgen')
        AjaxCall(de_text, en_text);
    }
};
async function ocrTransformer(language, img_id) {
    const { data: { text } } = await Tesseract.recognize(
        document.getElementById(img_id).src,
        language, {
            logger: m => console.log(m)
        }
    )
    return text
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

function handleFileSelect(evt, id) {
    if (window.FileReader) {
    var file_list = evt.target.files;
    var file = file_list[0];
    var reader = new FileReader();
    
        reader.onload = (function(theFile) {
        return function(e) {
            document.getElementById("output_"+id).innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" class="img" width="200", height=280, style="border-radius:12px" id="', "img"+id, '"/>'].join('');
        };
        })(file);

        reader.readAsDataURL(file);
    } else {
        alert('This browser does not support FileReader');
    }
    }

//interrogation.html

function onloadIntroduction() {
    const utterance = new SpeechSynthesisUtterance("hallo ich bin de de sina, heute werde ich Sie abfragen, sprechen Sie bitte deutlich ins mikrofon, damit ich Sie verstehen kann")
    window.speechSynthesis.speak(utterance)
    alert("Erlaube uns bitte Zugriff auf dein Mikrofon, um dich abfragen zu lassen.")
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        console.log('You let me use your mic!')
    })
    .catch(function(err) {
        console.log('No mic for you!')
    });
}

function drawChart(datalist) {
                            
    var data = google.visualization.arrayToDataTable(datalist);

    var options = {
    chart: {
    title: 'Verlauf',
    },
    chartArea: {
        backgroundColor: '#40928A',
        top:0, 
        left:0,
        height:'100%',
        width:'100%'
        }
        
    };

    var chart = new google.visualization.AreaChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
    }

function speak(sentence) {
    const utterance = new SpeechSynthesisUtterance(sentence)
    window.speechSynthesis.speak(utterance)
}

function startConverting() {   
        
    return new Promise((resolve, reject) => {
        var r=document.getElementById('result');
        var spr=new webkitSpeechRecognition(); //Initialisation of web Kit
            spr.continuous=true; //True if continous conversion is needed, false to stop transalation when paused 
            spr.interimResults=false;
            spr.lang='en-IN'; // Set Input language
            spr.start(); //Start Recording the voice
        var ftr='';
        spr.onresult = function (event) {            
            var interimTranscripts='';
            for(var i=event.resultIndex;i<event.results.length;i++)
            {
                var transcript=event.results[i][0].transcript;
                transcript.replace("\n","<br>")
                if(event.results[i].isFinal){
                    ftr+=transcript;
                }
                else
                interimTranscripts+=transcript;
            };
            r.innerHTML=ftr +interimTranscripts ;
            resolve(ftr +interimTranscripts); // Resolve with the text value you need
            };
            spr.onerror = reject;
    });  
    }

function voc_transformer(voc_id) {
    var voclist = document.getElementById(voc_id).textContent;
    voclist = voclist.split(","); // Split the String into an array
    voclist.forEach((x, i) => {
        voclist[i] = voclist[i].includes('"') ? voclist[i].replaceAll('"', "").trim()
        : voclist[i].replaceAll("'", "").trim(); // Delete the apostrophs
        voclist[i] = voclist[i].replace(/\[/g, "").replace(/\]/g, ""); // Delete the brackets []
    });
    console.log(voclist);
    return voclist;
}

async function abfrage() {
    voclisten = voc_transformer("voclisten"); // Transform String with Vocabulary into array with Vocabulary
    voclistde = voc_transformer("voclistde");
    if (voclistde.length == voclisten.length) { 
        var points = 0;
        var voc_asked = 0;
        var datalist = [["Runden", "Richtige Vokabeln"],[0, 0]];
        drawChart(datalist);
        for (var i = 0; i < voclistde.length; i++) {
            var voc_asked = voc_asked+1;
            speak("was heißt"+ voclistde[i]);
            const user_response = await startConverting();
            var user_response_low = user_response.toLowerCase();
            var correct_pct_elem = document.getElementById("correct_pct_elem");
            var points_elem = document.getElementById("points_elem");
            var last_voc_elem = document.getElementById("last_voc_elem");
            if(voclisten[i].toLowerCase().includes(user_response_low) || voclisten[i].toLowerCase()==user_response_low || user_response_low.toLowerCase().includes(voclisten[i])) {
                var points = points+1;
                var correct_pct = Math.round(points/voc_asked*100);
                datalist.push([i, points]);
                speak("Sehr gut, das war richtig")
            }
            else {
                var correct_pct = Math.round(points/voc_asked*100);
                datalist.push([i, points]);
                speak(user_response+" ist leider falsch") 
            }
            var last_voc = voclisten[i];
            last_voc_elem.innerHTML = last_voc_elem.innerHTML.replace(last_voc_elem.textContent, last_voc);
            correct_pct_elem.innerHTML = correct_pct_elem.innerHTML.replace(correct_pct_elem.textContent, correct_pct+"%");
            points_elem.innerHTML = points_elem.innerHTML.replace(points_elem.textContent, points);
            drawChart(datalist);
        }
        speak("Die Abfrage ist beendet. Sie hatten"+correct_pct.toString()+" Prozent richtig.")
    }
    else {
        document.location.href = "fotos"
        alert("Leider ist uns ein Fehler unterlaufen. Stelle bitte sicher, dass die Anzahl der deutschen und englischen Vokabeln gleich ist. Wenn dies bereits der Fall ist, dann schreibe bitte der support Email (VocAskContact@gmail.com), die du unter About findest. Vielen Dank für deine Geduld.")
    }
}

//saved-vocabulary.html

var submit = function(event) {
    event.preventDefault();
    document.getElementById('loader').innerHTML = ['<div class="loader" id="loader"></div>']
   
    if( $(".inside-checkbox-box").is(":checked")){
        document.getElementById('submit-button').form.submit();
        } else {
            alert("Checkbox is unchecked.");
            window.location = "/abfrage/gespeichert/";
        }
}
function hideVocSets(id) {
    var vocSet = document.getElementById("voc-set-"+id);
    var arrowIcon = document.getElementById("arrow-icon"+id);
    // If the checkbox is checked, display the output text
    if (vocSet.style.display == "none"){
        vocSet.style.display = "block";
        arrowIcon.className = "fa fa-chevron-up";
    } else {
        vocSet.style.display = "none";
        arrowIcon.className = "fa fa-chevron-down";
    }
  }

//vocabulary-correction.html
function submit() {
    var checkBox = document.getElementById("switch");
    if (checkBox.checked == false){
      document.getElementById("titleField").value = "!h4fd46rZMJ4zf&2hm3"
    }
    var button = document.getElementById('weiter_btn');
    button.form.submit();
  }

function displayTitleField() {
    // Get the checkbox
    var checkBox = document.getElementById("switch");
    // Get the output text
    var titleBox = document.getElementById("title-box");

    // If the checkbox is checked, display the output text
    if (checkBox.checked == true){
        titleBox.style.display = "block";
    } else {
        titleBox.style.display = "none";
    }
}

