const apiKey = "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";

const maxImages = 4; //numero de imagens a serem geradas em um comando
let selectedImageNumber = null; 

//funcao que gera um numero entre o minimo e o maximo 
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min +1)) + min;
}

//funcao para desabilitar o botao de gerar imagens durante o processo
function disableGenerateButton(){
    document.getElementById("gerar").disabled = true;
}

//funcao para habilitar o botao de gerar imagens apos o processo
function enableGenerateButton(){
    document.getElementById("gerar").disabled = false;
}

//funcao para limpar a imagem gerada
function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

//funcao para gerar as imagens
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const laoding = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for(let i = 0; i < maxImages; i++){
        //gerar um numero aleatorio entre 1 e 10000, e anexar a barra descritiva
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        //adicionamos um numero aleatorio a barra descritiva para criar diferentes resultados
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt}),
            }
        );
        
        if(!response.ok){
            alert("Falha ao gerar imagem!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    laoding.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; //reseta o numero da imagem selecionada
}

document.getElementById("gerar").addEventListener('click', () =>{
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    //definir o nome do arquivo de acordo com a imagem selecionada
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}