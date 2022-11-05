
//base-layout.html

/**
 * If hamburgermenu is active this method makes sure the dropdownmenu is shown when the hamburger icon is clicked.
 * @param  {html-Element} topNav Top navigation menu
*/
function menuResponsiveness() {
    var topNav = document.getElementById("myTopnav");
    if (topNav.className === "topnav") {
        topNav.className += " responsive";
    } else {
        topNav.className = "topnav";
    }
  }

/**
 * When the user scrolls down 20px from the top of the document, show the scroll to the top button.
 * @param  {html-Element} scrollButton The button to scroll to the top of the page
*/
function scrollFunction() {
    var scrollButton = document.getElementById("scroll-top-button");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollButton.style.display = "block";
    } else {
        scrollButton.style.display = "none";
    }
}

/**
 *  When the user clicks the scroll to the button, the scroll height is set to zero.
*/
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
  
//foto-upload.html

/**
 * This method is executed when the submit button on fot.html page is clicked. It checks if all the 
 * fotos were uploaded and makes sure the fotos go through the ocr process and are sent to the backend via AjaxCall.   
 * @param  {text} alertTxt That is the alert text displayed in case of a wrong submission.
 * @param  {text} deVocTxt The german vocabulary scanned from the uploaded image as text. 
 * @param  {text} enVocTxt The english vocabulary scanned from the uploaded image as text. 
*/
async function submitFotos(event) {
    event.preventDefault();
    document.getElementById('loader').innerHTML = ['<div class="loader" id="loader"></div>']
    if(!document.getElementById('imgde') || !document.getElementById('imgen')) {
        if(!document.getElementById('imgde')) {
            var alertTxt = "Es wurde kein Foto der deutschen Vokabeln hochgeladen."
        }
        if(!document.getElementById('imgen')) {
            var alertTxt = "Es wurde kein Foto der englischen Vokabeln hochgeladen."
        }
        if(!document.getElementById('imgde') & !document.getElementById('imgen')) {
            var alertTxt = "Es wurden keine Fotos hochgeladen."
        }
        alert(alertTxt)
        window.location = "/abfrage/fotos"
    }
    else {
        let deVocTxt = await ocrTransformer('deu', 'imgde')
        console.log(deVocTxt)
        let enVocTxt = await ocrTransformer('eng', 'imgen')
        AjaxCall(deVocTxt, enVocTxt);
    }
};

/**
 * This method passes the image to the Tesseract library and returns the recognized text.
 * @param  {text} language The language in which the text on the image is written in.
 * @param  {text} imgId The id of the html-Element of the image. 
 * @return {text} All the text found on the image is returned. 
*/
async function ocrTransformer(language, imgId) {
    const { data: { text } } = await Tesseract.recognize(
        document.getElementById(imgId).src,
        language, {
            logger: m => console.log(m)
        }
    )
    return text
}

/**
 * This method passes the inputted text from the Frontend to the Backend.
 * @param  {text} textDe German vocabulary as text.
 * @param  {text} textEn English vocabulary as text.
*/
function AjaxCall(textDe, textEn) {
    $.ajax({
        type: 'POST',
        url: "/abfrage/korrektur/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), // to avois csrf error
            txt_voc_en: textEn,
            txt_voc_de: textDe
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

/**
 * This method takes care of the file selection process on the foto.html page and displays the uploaded image in the upload field.
 * @param  {event} evt Brings infromation that describe the event and its current status.
 * @param  {text} id Id of the output html-element.
 * @param  {file} file The uploaded file accessed via the target of the event.
 * @param  {object} reader Object of the FileReader API.
*/
function handleFileSelect(evt, id) {
    if (window.FileReader) {
    var file = evt.target.files[0];
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

/**
 * This method is executed right after the interrogations.html is loaded and introduces the user to the websites voice.
 * @param  {object} utterance Object of the SpeechSynthesisUtterance API.
*/
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

/**
 * This method draws an area Chart with the inputted data.
 * @param  {array} datalist Two-dimensional array with number of vocabulary asked and points reached.
 * @param  {data table} data Two-dimensional array as data table.
 * @param  {chart} chart Object of google's AreaChart.
*/
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

/**
 * This method outputs the inputted sentence as browser voice.
 * @param  {text} sentence Text that should be outputtet.
 * @param  {object} utterance Object of the SpeechSynthesisUtterance API.
*/
function speak(sentence) {
    const utterance = new SpeechSynthesisUtterance(sentence)
    window.speechSynthesis.speak(utterance)
}

/**
 * This method converts the users voice into text and displays it on the screen.
 * @param  {html-element} r Html-Element that displays the words said by the user.
 * @param  {object} spr Object of the webkitSpeechRecognition.
 * @param  {object} ftr Empty string that.
 * @return Promise
*/
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

/**
 * This method transforms the vocabulary as an arry inside a string to a normal array.
 * @param  {text} vocId id of html-element with vocabulary string.
 * @param  {text} voclist String of vocabulary that is converted to an array.
 * @return  {array} vocabulary in array.
*/
function vocTransformer(vocId) {
    var voclist = document.getElementById(vocId).textContent;
    voclist = voclist.split(","); // Split the String into an array
    voclist.forEach((x, i) => {
        voclist[i] = voclist[i].includes('"') ? voclist[i].replaceAll('"', "").trim()
        : voclist[i].replaceAll("'", "").trim(); // Delete the apostrophs
        voclist[i] = voclist[i].replace(/\[/g, "").replace(/\]/g, ""); // Delete the brackets []
    });
    console.log(voclist);
    return voclist;
}

/**
 * This method handels the interrogation. It asks the qustions and responds to the user and it updates the statistics.
 * @param {array} voclisten Englisch vocabulary list.
 * @param {array} voclistde German vocabulary list.
 * @param {number} points Amount of points the user got by answering correct. One right answer gives one point.
 * @param {number} vocAsked Amount of vocabulary asked.
 * @param {array} datalist Two-dimensional array with number of vocabulary asked and points reached.
 * @param {text} userResponse Response of the user to the vocabulary question.
 * @param {text} userResponseLow Response of the user to the vocabulary question in lowercase.
 * @param {html-Element} correctPctElem Html-Element that displays the percentage the user answered right.
 * @param {html-Element} pointsElem Html-Element that displays the amount of points.
 * @param {html-Element} lastVocElem Html-Element that displays the solution to the asked vocabulaary question.
 * @param {number} correctPct Percentage of questions the user answered right.
 * @param {text} lastVoc The last vocabulary asked in englsh. Therfore the solution to the last question.
*/
async function interrogation() {
    voclisten = vocTransformer("voclisten"); // Transform String with Vocabulary into array with Vocabulary
    voclistde = vocTransformer("voclistde");
    if (voclistde.length == voclisten.length) { 
        var points = 0;
        var vocAsked = 0;
        var datalist = [["Runden", "Richtige Vokabeln"],[0, 0]];
        drawChart(datalist);
        for (var i = 0; i < voclistde.length; i++) {
            var vocAsked = vocAsked+1;
            speak("was heißt"+ voclistde[i]);
            const userResponse = await startConverting();
            var userResponseLow = userResponse.toLowerCase();
            var correctPctElem = document.getElementById("correct_pct_elem");
            var pointsElem = document.getElementById("points_elem");
            var lastVocElem = document.getElementById("last_voc_elem");
            if(voclisten[i].toLowerCase().includes(userResponseLow) || voclisten[i].toLowerCase()==userResponseLow || userResponseLow.toLowerCase().includes(voclisten[i])) {
                var points = points+1;
                var correctPct = Math.round(points/vocAsked*100);
                datalist.push([i, points]);
                speak("Sehr gut, das war richtig")
            }
            else {
                var correctPct = Math.round(points/vocAsked*100);
                datalist.push([i, points]);
                speak(userResponse+" ist leider falsch") 
            }
            var lastVoc = voclisten[i];
            lastVocElem.innerHTML = lastVocElem.innerHTML.replace(lastVocElem.textContent, lastVoc);
            correctPctElem.innerHTML = correctPctElem.innerHTML.replace(correctPctElem.textContent, correctPct+"%");
            pointsElem.innerHTML = pointsElem.innerHTML.replace(pointsElem.textContent, points);
            drawChart(datalist);
        }
        speak("Die Abfrage ist beendet. Sie hatten"+correctPct.toString()+" Prozent richtig.")
    }
    else {
        document.location.href = "fotos"
        alert("Leider ist uns ein Fehler unterlaufen. Stelle bitte sicher, dass die Anzahl der deutschen und englischen Vokabeln gleich ist. Wenn dies bereits der Fall ist, dann schreibe bitte der support Email (VocAskContact@gmail.com), die du unter About findest. Vielen Dank für deine Geduld.")
    }
}

//saved-vocabulary.html

/**
 * This method submits the form on the saved-vocabulary.html page and activates the loader animation.
*/
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

/**
 * This method hides the saved vocabulary set on the saved-vocabulary.html page, that has the inputted id and adapts the arrow icon to show up or down.
 * @param {text} id Part of the id of the of the aimed at vocabulary set.
 * @param {html-element} vocSet Html-element of the aimed at vocabulary set.
 * @param {html-element} arrowIcon Html-element arrow icon of the aimed at vocabulary set.
*/
function hideVocSets(id) {
    var vocSet = document.getElementById("voc-set-"+id);
    var arrowIcon = document.getElementById("arrow-icon"+id);
    if (vocSet.style.display == "none"){
        vocSet.style.display = "block";
        arrowIcon.className = "fa fa-chevron-up";
    } else {
        vocSet.style.display = "none";
        arrowIcon.className = "fa fa-chevron-down";
    }
  }

//vocabulary-correction.html

/**
 * This method submits the form on the vocabulary-correction.html page.
 * @param {html-element} checkBox Html-element check box.
 * @param {html-element} button Html-element of the submit button.
*/
function submit() {
    var checkBox = document.getElementById("switch");
    if (checkBox.checked == false){
      document.getElementById("titleField").value = "!h4fd46rZMJ4zf&2hm3"
    }
    var button = document.getElementById('weiter_btn');
    button.form.submit();
  }

/**
 * This method displays the title field on the vocabulary-correction.html page.
 * @param {html-element} checkBox Html-element check box.
 * @param {html-element} titleBox Html-element title box.
*/
function displayTitleField() {
    // Get the checkbox
    var checkBox = document.getElementById("switch");
    // Get the output text
    var titleBox = document.getElementById("title-box");

    // If the checkbox is checked, display the title box
    if (checkBox.checked == true){
        titleBox.style.display = "block";
    } else {
        titleBox.style.display = "none";
    }
}

