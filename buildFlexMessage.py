import json
import os

# 讀取白名單
def load_whitelist(whitelist_path):
    with open(whitelist_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# 輸入和輸出文件夾
input_folder = "orig_messages"
output_folder = "processed_messages"
whitelist_file = "whitelist.json"

# 確保輸出文件夾存在
os.makedirs(output_folder, exist_ok=True)

# 載入白名單
whitelist = load_whitelist(whitelist_file)
print(whitelist)

# 處理每個文件
for filename in os.listdir(input_folder):
    input_path = os.path.join(input_folder, filename)
    output_path = os.path.join(output_folder, filename)
    
    # 讀取原始 JSON 文件
    with open(input_path, 'r', encoding='utf-8') as file:
        orig_data = json.load(file)
    
    # 創建新的 JSON 結構
    new_data = {
        "type": "flex",
        "altText": "謝謝您的分享│電子名片！",
        "contents": orig_data
    }
    
    # 將新的 JSON 結構寫入輸出文件
    with open(output_path, 'w', encoding='utf-8') as file:
        json.dump(new_data, file, ensure_ascii=False, indent=2)
    
    print(f"處理完成: {filename}")

print("所有文件處理完成")