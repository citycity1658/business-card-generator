document.getElementById('business-card-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // 获取输入数据
    const name = String(document.getElementById('name').value);
    const title = String(document.getElementById('title').value);
    const email = String(document.getElementById('email').value);
    const phone = String(document.getElementById('phone').value);
    const website = String(document.getElementById('website').value);

    // 创建 vCard 字符串
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${title}
EMAIL:${email}
TEL:${phone}
URL:${website}
END:VCARD`;

    // 生成二维码
    const qrcodeElement = document.getElementById('qrcode');
    QRCode.toCanvas(qrcodeElement, vCard, {
        width: 200,
        margin: 4
    }, function (error) {
        if (error) {
            console.error('生成二维码时出错:', error);
            alert('生成二维码时出错，请稍后再试。');
        } else {
            console.log('二维码生成完成!');
        }
    });
});
