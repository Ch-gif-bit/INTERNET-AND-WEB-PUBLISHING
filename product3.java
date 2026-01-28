  <script>
        // 核心进化：颜色按钮只能单选
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 先移除所有颜色按钮的 'selected' 类
                colorButtons.forEach(btn => btn.classList.remove('selected'));
                // 给当前点击的按钮加上 'selected' 类
                this.classList.add('selected');
            });
        });
    </script>

    <script>

        const sizeButtons=document.querySelectorAll('.size-btn');
        sizeButtons.forEach(button=>{
            button.addEventListener('click',function(){// toggle 的作用是：有点选类名就删掉（变白），没有就加上（变黑）
                sizeButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.toggle('selected');
            });
        });
    </script>
