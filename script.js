document.getElementById('business-card-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // 获取输入数据
    const name = String(document.getElementById('name').value);
    const title = String(document.getElementById('title').value);
    const email = String(document.getElementById('email').value);
    const phone = String(document.getElementById('phone').value);
    const website = String(document.getElementById('website').value);
        // 更新名片預覽
        document.getElementById('preview-name').textContent = name;
        document.getElementById('preview-title').textContent = title;
        document.getElementById('preview-email').textContent = email;
        document.getElementById('preview-phone').textContent = phone;
        document.getElementById('preview-website').textContent = website;

    // 创建 vCard 字符串
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${title}
EMAIL:${email}
TEL:${phone}
URL:${website}
END:VCARD`;

    // 清除之前的二维码和下载按钮
    const qrcodeElement = document.getElementById('qrcode');
    qrcodeElement.innerHTML = '';
    const downloadContainer = document.getElementById('download-container');
    downloadContainer.innerHTML = '';

    // 生成二维码
    QRCode.toCanvas(qrcodeElement, vCard, {
        width: 200,
        margin: 4
    }, function (error) {
        if (error) {
            console.error('生成二维码时出错:', error);
            alert('生成二维码时出错，请稍后再试。');
        } else {
            console.log('二维码生成完成!');

            // 创建下载按钮
            const downloadBtn = document.createElement('a');
            downloadBtn.textContent = '下载二维码';
            downloadBtn.classList.add('download-btn');
            downloadBtn.href = qrcodeElement.toDataURL('image/png');
            downloadBtn.download = 'qrcode.png';
            downloadContainer.appendChild(downloadBtn);
        }
    });
});
