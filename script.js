function getCardKey() {
    const params = new URLSearchParams(window.location.search);
    var cardKey = params.get('key');
    return cardKey;
}

async function fetchCardData(key) {
    const response = await fetch('api.json');
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

document.addEventListener('DOMContentLoaded', async function() {

    try {

        await liff.init({ liffId: "2006307570-gVmJm6v1" });
        if (!liff.isLoggedIn()) {
            liff.login();
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

        if (liff.isInClient()) {
            shareButton.addEventListener('click', async function() {  // 将事件监听器改为异步函数
                try {
                    const res = await liff.shareTargetPicker([flexMessage]);  // 使用数组包裹 flexMessage
                    if (res) {
                        alert('名片已分享');
                    } else {
                        alert('分享已取消');
                    }
                } catch (error) {
                    console.error('分享失败', error);
                }
            });
        } else {
            shareButton.textContent = '請在 LINE 應用程式中開啟';
            shareButton.disabled = true;
        }

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
