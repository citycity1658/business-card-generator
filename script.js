function getCardKey() {
    const params = new URLSearchParams(window.location.search);
    var cardKey = params.get('key');
    return cardKey;
}

async function fetchCardData(key) {
    // 定義基礎 URL
    const baseUrl = 'https://citycity1658.github.io/business-card-generator/';  // 替換為您的實際 URL

    try {
        const response = await fetch(`${baseUrl}processed_messages/${key}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('獲取數據時出錯:', error);
        throw error;
    }
}

async function sendShare(flexMessage) {

    //  alert(JSON.stringify(flexs)); //12312
      liff.shareTargetPicker([flexMessage]).then(function() {
          //window.alert('Message sent');
          if (!window.liff.isInClient()) {
              window.sendAlertIfNotInClient();
          } else {
              window.liff.closeWindow();
          }
      }).catch(function(error) {

              if(error == 'TypeError: window.sendAlertIfNotInClient is not a function'){

              }else{
                 alert('傳送失敗'+error);
              }



      });


  }

document.addEventListener('DOMContentLoaded', async function() {

    try {

        await liff.init({ liffId: "2006307570-gVmJm6v1" });
        if (!liff.isLoggedIn()) {
            liff.login({currentUrl: window.location.href});
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const cardKey = urlParams.get('key');
        const flexMessage = await fetchCardData(cardKey);  // 使用 await 等待数据获取完成
        console.log(flexMessage);

        const shareButton = document.getElementById('shareButton');
        const downloadQRButton = document.getElementById('downloadQRButton');
        const cardInfo = document.getElementById('cardInfo');
        console.log(cardInfo);
        cardInfo.innerHTML = `<p class="lead">名片已準備好分享</p>`;

        // 生成當前頁面的URL
        const currentUrl = window.location.href;

        shareButton.addEventListener('click', async function() {
            try {
                sendShare(flexMessage);
            } catch (error) {
                console.error('分享失敗', error);
                alert('分享過程中發生錯誤');
            }
        });

        // 更新分享按鈕文字
        shareButton.textContent = '分享名片';

        downloadQRButton.addEventListener('click', function() {
            const canvas = document.querySelector('#qrcode canvas');
            const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = image;
            link.click();
        });

    } catch (error) {
        console.error('Error:', error);
        alert('獲取名片數據時出錯');
    }
});
