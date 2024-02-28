<?php
    $leaderboard = trim($_POST['leaderboard']);
    $leaderboard = json_encode($leaderboard, JSON_PRETTY_PRINT);
    
    file_put_contents('../leaderboard.json', $leaderboard);
?>