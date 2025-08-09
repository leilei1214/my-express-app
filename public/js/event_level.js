function show_level(level){
        // 1. 移除所有按鈕的 active
    document.querySelectorAll('button[data-subtab]').forEach(btn => {
        btn.classList.remove('active');
    });

    // 2. 找到對應 level 的按鈕，加上 active
    document.querySelector(`button[onclick="show_level('${level}')"]`).classList.add('active');

    // 3. 這裡你可以加載對應的資料
    console.log("現在選擇的等級是：", level);
    
    fetch('./api/event', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({ identifier: "none",level:level })
      })
      .then(response => {
          if (!response.ok) {
              if (response.status == 400) {
                  window.location.href = "/login";  // 如果狀態碼是 400，跳轉到登入頁
              }
              else if (response.status == 404) {
                activitiesHtml = "尚未建立活動";  // 如果狀態碼是 400，跳轉到登入頁

                return;
              }
              throw new Error(`Network response was not ok, status: ${response.status}`);
          }
          return response.json();  // 解析 JSON 響應
      })
      .then(data => {
            console.log('Response data:', data);  // 查看完整響應

            const activities = Array.isArray(data) ? data : [];

            // 生成每個活動的 HTML
            let activitylevel = '';
            let activitiesHtml = '';
            if (activities.length === 0) {
                console.log("No activities to display");
                activitiesHtml = "尚未建立活動";  // 如果狀態碼是 400，跳轉到登入頁
                const carousel = $('#myCarousel');
                carousel.html(activitiesHtml);
            }
          
          for (let activity of activities) {
              activitylevel = '';
              
              console.log('Activity:', activity);

              // 檢查時間是否有效
              const eventDate = new Date(activity.time);
              if (isNaN(eventDate)) {
                  console.error('Invalid date:', activity.time);
                  continue;  // 跳過無效日期的活動
              }

              const formattedDate = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')} ${String(eventDate.getHours()).padStart(2, '0')}:${String(eventDate.getMinutes()).padStart(2, '0')}`;
              const levels = activity.activity_level.replace(/^{|}$/g, '').split(',');
              for (const item of levels) {
                  if( item == "基礎"){
                    activitylevel += `
                      <div class="badge badge-primary">${item}
                      </div>
                    `
                  }
                  else if( item == "實踐"){
                    activitylevel += `
                      <div class="badge badge-red">${item}
                      </div>
                    `
                  }
                  else{
                    activitylevel += `
                      <div class="badge badge-secondary">${item}
                      </div>
                    `
                  }

              }
              activitiesHtml += `
                  <div class="item mb-3" style="width: 330px; margin-right: 30px;" onclick="event_content_href(${activity.id })">
                      <article class="product">
                          <header class="product-header">
                              ${activitylevel}
                              <div class="product-figure">
                                  <img src="images/戰術對抗訓練.jpg" alt="活動圖片">
                              </div>
                          </header>
                          <footer class="product-content">
                              <h6 class="product-title"><a href="product-page.html">${activity.activity_notice}</a></h6>
                              <div class="post-future-meta product-price">
                                  <div class="post-future-time"><span class="icon mdi mdi-clock"></span><time datetime="${formattedDate}">${formattedDate}</time></div>
                              </div>
                              <div class="product-price"><p><i class="icon mdi mdi-map-marker"></i> ${activity.location}</p></div>
                              <hr>
                              <div class="product-price"><span class="heading-6 product-price-new">$${activity.amount}</span></div>
                              <p><strong>目前參加人數：</strong>${activity.current_participants} / ${activity.max_participants}</p>
                          </footer>
                      </article>
                  </div>
              `;
          }
          // activitiesHtml +=`</div>`
          // 確保插入的元素存在
          console.log($('#select_event'));  // 確保選擇器正確
          const carousel = $('#myCarousel');

          // 先銷毀先前的 carousel (如果有初始化過)
          if (carousel.hasClass('owl-loaded')) {
            carousel.trigger('destroy.owl.carousel');
            carousel.html('');  // 清空原本的內容
          }

          // 放入新內容
          carousel.html(activitiesHtml);
          // carousel.html(activitiesHtml);  // 插入活動卡片;
          // $('#select_event').html(activitiesHtml);  // 插入 HTML
          

          // 延遲初始化 Owl Carousel，確保 HTML 插入後執行
          setTimeout(() => {
          // $('#select_event').html(activitiesHtml).promise().done(()
            // $('#select_event').html(activitiesHtml).promise().done(() => {
                carousel.owlCarousel({
                    items: 3,
                    margin: 30,
                    nav: true,
                    dots: false,
                    loop: activities.length > 3,
                    autoplay: true,
                    autoplayTimeout: 4000,
                    responsive: {
                        0: { items: 1 },
                        600: { items: 2 },
                        1000: {items:3 }
                    }
                });
            // })

          }, 1000);  // 延遲初始化，確保內容已插入

      })
      .catch((error) => {
          console.error('Error:', error);
      });

}