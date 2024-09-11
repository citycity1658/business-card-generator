document.getElementById('background-image').addEventListener('change', handleImageUpload);

// 处理图片上传的函数
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // 创建一个临时canvas来调整图片大小
                const tempCanvas = document.createElement('canvas');
                const ctx = tempCanvas.getContext('2d');
                const MAX_WIDTH = 300;
                const MAX_HEIGHT = 400;
                let width = img.width;
                let height = img.height;

                // 调整图片大小
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                tempCanvas.width = width;
                tempCanvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // 将调整大小后的图片保存为 base64 字符串
                window.resizedBackgroundImage = tempCanvas.toDataURL('image/jpeg');
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

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

    // 创建新的 canvas 元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置 canvas 大小
    canvas.width = 300;
    canvas.height = 400;

    // 加载底图
    const img = new Image();
    img.onload = function() {
        // 绘制底图
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 生成二维码
        QRCode.toCanvas(canvas, vCard, {
            width: 200,
            margin: 2,
            x: 50,
            y: 100
        }, function (error) {
            if (error) {
                console.error('生成二维码时出错:', error);
                alert('生成二维码时出错，请稍后再试。');
            } else {
                console.log('二维码生成完成!');
                // 将生成的图像显示在页面上
                const qrcodeElement = document.getElementById('qrcode');
                qrcodeElement.innerHTML = '';
                qrcodeElement.appendChild(canvas);
            }
        });
    };
    img.src = window.resizedBackgroundImage || 'path/to/default/background.jpg';  // 使用调整大小后的图片或默认图片
});
