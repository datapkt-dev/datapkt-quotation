<script setup>

</script>
<template>
    <div class="page-404">
        <div class="page-404-content">
            <div class="page-404-content-title">404</div>
            <div class="page-404-content-subtitle">Page not found</div>
            <div class="page-404-content-description">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</div>
            <!-- <router-link to="/" class="page-404-content-button">輸入報價單編號</router-link> -->
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .page-404 {
        position: relative;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background: #f6f6f6;
    }
    .page-404-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-radius: 10px;
        background: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .page-404-content-title {
        font-size: 100px;
        font-weight: 700;
        color: #f56c6c;
    }
    .page-404-content-subtitle {
        font-size: 24px;
        font-weight: 700;
        color: #f56c6c;
    }
    .page-404-content-description {
        font-size: 16px;
        color: #333333;
        margin-top: 10px;
    }
    .page-404-content-button {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        background: #f56c6c;
        color: #ffffff;
        text-decoration: none;
    }
</style>