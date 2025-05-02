const input = document.getElementById('questionInput');
const answerBox = document.getElementById('answerBox');
const loading = document.getElementById('loading');

input.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const question = input.value.trim();
        if (!question) return;

        // 重置界面状态
        input.value = '';
        answerBox.textContent = '';
        loading.classList.remove('hidden');

        try {
            // 发送请求到本地代理
            const response = await fetch('http://localhost:3000/api/qwen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: { prompt: question } })
            });

            // 处理响应
            const data = await response.json();
            console.log("阿里云原始响应：", data); // 调试日志

            // 空值保护（防止undefined错误）
            const answer = data?.output?.text || "暂无回答";
            
            // 更新界面
            loading.classList.add('hidden');
            displayAnswer(answer);

        } catch (error) {
            // 错误处理
            console.error("请求失败：", error);
            loading.classList.add('hidden');
            answerBox.textContent = '服务暂时不可用';
        }
    }
});

function displayAnswer(text) {
    let index = 0;
    answerBox.textContent = '';
    const timer = setInterval(() => {
        answerBox.textContent += text[index];
        index++;
        if (index >= text.length) clearInterval(timer);
    }, 50);
}