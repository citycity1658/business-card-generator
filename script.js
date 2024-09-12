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

        // 生成當前頁面的URL
        const currentUrl = window.location.href;
        generateQRCode(currentUrl);

        shareButton.addEventListener('click', async function() {
            try {
                if (liff.isInClient()) {
                    const res = await liff.shareTargetPicker([flexMessage]);
                    if (res) {
                        alert('名片已分享');
                    } else {
                        alert('分享已取消');
                    }
                } else {
                    // 對於電腦版，提供複製鏈接的選項
                    navigator.clipboard.writeText(currentUrl).then(function() {
                        alert('鏈接已複製到剪貼板，您可以直接分享此鏈接');
                    }, function(err) {
                        console.error('無法複製鏈接: ', err);
                        alert('無法自動複製鏈接，請手動複製瀏覽器地址欄中的URL進行分享');
                    });
                }
            } catch (error) {
                console.error('分享失敗', error);
                alert('分享過程中發生錯誤');
            }
        });

        // 更新分享按鈕文字
        shareButton.textContent = liff.isInClient() ? '分享名片' : '複製分享鏈接';

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
