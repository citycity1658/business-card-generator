document.getElementById('business-card-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const title = document.getElementById('title').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const website = document.getElementById('website').value;

    // 更新名片預覽
    document.getElementById('preview-name').textContent = name;
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-email').textContent = email;
    document.getElementById('preview-phone').textContent = phone;
    document.getElementById('preview-website').textContent = website;

    // 構建vCard內容
    const vCard = `
    BEGIN:VCARD
    VERSION:3.0
    N:${name}
    TITLE:${title}
    EMAIL:${email}
    TEL:${phone}
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
