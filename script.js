function getCardKey() {
    const params = new URLSearchParams(window.location.search);
    return params.get('key');
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
    const cardKey = getCardKey();
    if (!cardKey) {
        alert('未提供有效的名片 key');
        return;
    }

    try {
        const flexMessage = await fetchCardData(cardKey);
        const cardInfo = document.getElementById('cardInfo');
        cardInfo.innerHTML = `<p class="lead">名片已準備好分享</p>`;

        // 生成當前頁面的 QR 碼
        generateQRCode(window.location.href);

        await liff.init({ liffId: "2006307570-gVmJm6v1" });

        const shareButton = document.getElementById('shareButton');
        const downloadQRButton = document.getElementById('downloadQRButton');

        if (liff.isInClient()) {
            shareButton.addEventListener('click', function() {
                liff.shareTargetPicker([flexMessage])
                    .then((res) => {
                        if (res) {
                            alert('名片已分享');
                        } else {
                            alert('分享已取消');
                        }
                    })
                    .catch((error) => {
                        console.error('分享失敗', error);
                    });
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
