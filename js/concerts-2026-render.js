/**
 * 2026演唱会行程页面渲染逻辑
 * 负责将 CONCERTS_2026 数据渲染为卡片列表，并处理筛选交互
 */

/**
 * HTML 文本转义，防止 XSS
 * @param {string} str - 原始字符串
 * @returns {string} 转义后的安全字符串
 */
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * 格式化日期范围为友好显示
 * @param {string} start - 起始日期 YYYY-MM-DD
 * @param {string} end - 结束日期 YYYY-MM-DD
 * @returns {string} 格式化后的日期文本
 */
function formatDateRange(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    const monthS = s.getMonth() + 1;
    const dayS = s.getDate();
    const dayE = e.getDate();
    if (s.getMonth() === e.getMonth()) {
        return `${monthS}月${dayS}日 - ${dayE}日`;
    }
    const monthE = e.getMonth() + 1;
    return `${monthS}月${dayS}日 - ${monthE}月${dayE}日`;
}

/**
 * 获取星期几的中文
 * @param {string} dateStr - 日期字符串
 * @returns {string} 周几
 */
function getWeekday(dateStr) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[new Date(dateStr).getDay()];
}

/**
 * 渲染单个演唱会卡片
 * @param {Object} c - 演唱会数据
 * @param {number} index - 序号（用于序号显示）
 * @returns {string} 卡片 HTML
 */
function renderConcertCard(c, index) {
    const status = STATUS_LABELS[c.concertStatus] || STATUS_LABELS.upcoming;
    const dateText = formatDateRange(c.startDate, c.endDate);
    const weekday = getWeekday(c.startDate);
    const venueDisplay = c.venueNickname
        ? `${escapeHtml(c.venue)}（${escapeHtml(c.venueNickname)}）`
        : escapeHtml(c.venue);

    // 票价档位标签
    const priceTiersHTML = c.priceTiers.length > 0
        ? c.priceTiers.map(t => `<span class="price-tier">${escapeHtml(t)}</span>`).join('')
        : '<span class="price-tier pending">待公布</span>';

    // 票务平台链接
    const platformsHTML = c.platforms.map(p => {
        const link = c.platformLinks[p];
        if (link) {
            return `<a href="${escapeHtml(link)}" target="_blank" rel="noopener" class="platform-link">${escapeHtml(p)} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`;
        }
        return `<span class="platform-link pending">${escapeHtml(p)}</span>`;
    }).join('');

    return `
    <article class="concert-card ${c.concertStatus}" data-status="${c.concertStatus}">
        <!-- 主题场馆图 -->
        <div class="card-image">
            <img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.theme)}主题场馆图" loading="lazy"
                 onerror="this.style.display='none';this.parentElement.classList.add('no-image')">
            <div class="card-image-overlay"></div>
            <div class="card-theme-tag">${escapeHtml(c.theme)}</div>
            <div class="card-city">${escapeHtml(c.city)}</div>
            <div class="card-index">No.${String(index + 1).padStart(2, '0')}</div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-body">
            <!-- 状态 + 主题 -->
            <div class="card-header">
                <span class="status-badge" style="color:${status.color}; border-color:${status.color};">
                    <i class="fa-solid ${status.icon}"></i> ${status.text}
                </span>
                <h3 class="card-title">${escapeHtml(c.theme)}</h3>
            </div>

            <!-- 亮点 -->
            <p class="card-highlight">
                <i class="fa-solid fa-star"></i> ${escapeHtml(c.highlight)}
            </p>

            <!-- 信息网格 -->
            <div class="info-grid">
                <div class="info-item">
                    <i class="fa-solid fa-calendar-days"></i>
                    <div class="info-content">
                        <span class="info-label">演出时间</span>
                        <span class="info-value">${dateText} · ${weekday}起</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-music"></i>
                    <div class="info-content">
                        <span class="info-label">演出场次</span>
                        <span class="info-value">${c.shows} 场连开</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <div class="info-content">
                        <span class="info-label">演出场馆</span>
                        <span class="info-value">${venueDisplay}</span>
                        <span class="info-sub">${escapeHtml(c.address)}</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-users"></i>
                    <div class="info-content">
                        <span class="info-label">场馆容量</span>
                        <span class="info-value">${escapeHtml(c.capacity)}</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-ticket"></i>
                    <div class="info-content">
                        <span class="info-label">票价区间</span>
                        <span class="info-value">${escapeHtml(c.priceRange)}</span>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-tag"></i>
                    <div class="info-content">
                        <span class="info-label">售票状态</span>
                        <span class="info-value">${escapeHtml(c.saleStatus)}</span>
                    </div>
                </div>
            </div>

            <!-- 票价档位 -->
            <div class="price-section">
                <span class="section-label"><i class="fa-solid fa-coins"></i> 票价档位</span>
                <div class="price-tiers">${priceTiersHTML}</div>
            </div>

            <!-- 票务平台 -->
            <div class="platform-section">
                <span class="section-label"><i class="fa-solid fa-mobile-screen"></i> 购票平台</span>
                <div class="platforms">${platformsHTML}</div>
            </div>
        </div>
    </article>`;
}

/**
 * 渲染全部演唱会卡片
 * @param {string} filter - 筛选条件：all / finished / ongoing / upcoming
 */
function renderConcertList(filter = 'all') {
    const container = document.getElementById('concertList');
    if (!container) return;

    let list = CONCERTS_2026;
    if (filter !== 'all') {
        list = CONCERTS_2026.filter(c => c.concertStatus === filter);
    }

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-calendar-xmark"></i><p>暂无符合条件的站点</p></div>`;
        return;
    }

    container.innerHTML = list.map((c, i) => renderConcertCard(c, CONCERTS_2026.indexOf(c))).join('');
}

/**
 * 初始化筛选按钮交互
 */
function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderConcertList(btn.dataset.filter);
        });
    });
}

// 页面加载完成后渲染
document.addEventListener('DOMContentLoaded', () => {
    renderConcertList('all');
    initFilterButtons();
});
