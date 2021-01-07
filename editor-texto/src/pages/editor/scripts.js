const {ipcRenderer} = require('electron');

const title = document.getElementById('title');
const textarea = document.getElementById('text');

ipcRenderer.on('set-file', function(event,data){
    console.log(data);
    textarea.value = data.content;
    title.innerHTML = data.name + ' | editor-texto';
});

function handleChangeText(){
    ipcRenderer.send('update-content',textarea.value);
}
