function getCardKey() {
    const params = new URLSearchParams(window.location.search);
    var cardKey = params.get('key');
    return cardKey;
}

async function fetchCardData(key) {
    const response = await fetch(`flex_messages/${key}.json`);
    if (!response.ok) {
        throw new Error('無法獲取名片數據');
    }
    const data = await response.json();
    if (!data[key]) {
        throw new Error('找不到對應的名片數據');
    }
    return data[key];
}

function generateQRCode(url) {
    const qrcodeElement = document.getElementById('qrcode');
    qrcodeElement.innerHTML = ''; // 清除舊的 QR 碼
    QRCode.toCanvas(qrcodeElement, url, { width: 200 }, function (error) {
        if (error) console.error('QR碼生成錯誤:', error);
    });
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
        generateQRCode(currentUrl);

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
