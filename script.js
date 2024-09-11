document.getElementById('business-card-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // 获取输入值并转换为字符串
    const name = String(document.getElementById('name').value);
    const title = String(document.getElementById('title').value);
    const email = String(document.getElementById('email').value);
    const phone = String(document.getElementById('phone').value);
    const website = String(document.getElementById('website').value);

    // 更新名片预览
    document.getElementById('preview-name').textContent = name;
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-email').textContent = email;
    document.getElementById('preview-phone').textContent = phone;
    document.getElementById('preview-website').textContent = website;

    // 构建vCard内容，使用模板字符串确保所有值都是字符串
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${title}
EMAIL:${email}
URL:${website}
END:VCARD`;

    // 使用qrcode库生成二维码
    QRCode.toCanvas(document.getElementById('qrcode'), vCard, function (error) {
        if (error) {
            console.error('生成二维码时出错:', error);
            alert('生成二维码时出错，请稍后再试。');
        } else {
            console.log('二维码生成完成!');
        }
    });
});
