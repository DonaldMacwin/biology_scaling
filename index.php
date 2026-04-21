<html lang="ja">

<head>
    <?php include "./meta.html"; ?>
    <style>footer{position:static !important; z-index:auto !important;}</style>
    <script type="module" crossorigin src="./dist/biology_scaling.js"></script>
    <link rel="stylesheet" crossorigin href="./dist/biology_scaling.css">
    <title>生物学 空間スケーラー</title>
</head>

<body>
    <div>
        <div id="root"></div>

        <div>
        <?php
        // allow_url_include が無効な環境向け：cURL で取得して出力
        $url = 'https://cf268321.cloudfree.jp/13jellies/asset/html/footer.html';
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            $resp = curl_exec($ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            if ($resp !== false && $code === 200) {
                // Wrap footer HTML to ensure it appears above app content
                echo '<div style="position:relative; z-index:1000;">' . $resp . '</div>';
            } else {
                echo '<div style="position:relative; z-index:1000;"><footer>Footer unavailable</footer></div>';
            }
        } else {
            echo '<div style="position:relative; z-index:1000;"><footer>Footer unavailable</footer></div>';
        }
        ?>
        </div>
        <!--<div>testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest</div>-->
    </div>
</body>

</html>