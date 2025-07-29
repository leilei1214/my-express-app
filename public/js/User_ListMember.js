
const path = window.location.pathname;
let Search_level = "0";
if(path == '/my-express-app/USER_Member_3'){
    Search_level = "3";
}
else if(path == '/my-express-app/USER_Member_4'){
    Search_level = "4";
}
else if(path == '/my-express-app/USER_Member_2'){
    Search_level = "2";
}
else if(path == '/my-express-app/USER_Member_1'){
    Search_level = "1";
}
else if(path == '/my-express-app/USER_Member_0'){
    Search_level = "0";
}
fetch('./api/User_list_member', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ identifier: "none",Search_level:Search_level }),
})
.then(response => {
    if (!response.ok) {
        if (response.status == 400) {
            // 如果狀態碼是 400，跳轉到登入頁
            // window.location.href = "/login";
            alert(`Network response was not ok, status: ${response.status}`)

        }
        throw new Error(`Network response was not ok, status: ${response.status}`);
    }
    return response.json(); // 解析 JSON 響應
})
.then(data => {
    
    console.log('Response data:', data); // 查看完整響應
    data.data.forEach(function(item, index) {

    const error_num = item.activitySum - item.SignOutSum;
    const levelMap = {
        1: "管理員",
        0: "教練",
        2: "實戰",
        3: "基礎",
        4: "樂踢"
    };

    const level = levelMap[item.level] || "未知等級";
        
    $(".list_member").append(
        `
        <div class="col-md-6 col-lg-4">
            <!-- ## fut-player-card ## -->
            <div class="fut-player-card">
            <div class="player-card-top">
                <div class="player-master-info">

                <div class="player-position">
                    <span>${item.preferred_position1}</span>
                </div>
                <div class="player-nation">
                    <div class="badge badge-primary">${level}
                        </div>
                </div>
                <div class="player-club">
                    <img src="./images/tooster.png" alt="Barcelona" draggable="false"/>
                </div>
                </div>
                <div class="player-picture">
                <img src="${item.user_img}" alt="Messi" draggable="false"/>
                
                </div>
            </div>
            <div class="player-card-bottom">
                <div class="player-info">
                <!-- Player Name-->
                <div class="player-name">
                    <span>${item.username}</span>
                </div>
                <!-- Player Features-->
                <div class="player-features">
                    
                    
                    
                    <div class="player-features-col"> 
                    <span>
                        <div class="player-feature-value ">參加</div>
                        <div class="player-feature-value">${item.activitySum}</div>

                    </span>

                    </div>
                    <div class="player-features-col"> 

                    <span>
                        <div class="player-feature-value">缺課</div>
                        <div class="player-feature-value">${error_num}</div>
                    </span>

                    </div>

                </div>
                </div>
            </div>
            </div>

        </div>
        `
    )
    });


        // 在這裡可以進行其他操作，例如顯示在頁面上
    }

)
.catch((error) => {

    console.error('Error:', error);
});
