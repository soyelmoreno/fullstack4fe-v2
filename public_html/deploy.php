<?php

/**
 * GIT DEPLOYMENT SCRIPT
 *
 * Used for automatically deploying websites via GitHub
 * Source: https://thecodebeast.com/auto-deploy-git-on-digital-ocean-or-any-other-vps/
 *
 */

// array of commands
$commands = array(
  'echo $PWD',
  'whoami',
  'git pull --rebase',
  'git status',
  // 'git submodule sync',
  // 'git submodule update',
  // 'git submodule status',
);

$logfile = realpath(__DIR__ . '/../logs/deploy.log');
// If file does not exist, establish the path to create the file
if ($logfile === false) {
  $logfile = __DIR__ . '/../logs/deploy.log';
}
// Ensure the file or its parent directory is writable
if (!is_writable(dirname($logfile))) {
  $notWritableMsg = 'Log directory is not writable.';
  $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown IP';
  error_log("Deploy script error from $clientIp: $notWritableMsg");
  http_response_code(500);
  exit($notWritableMsg);
}
$date = new DateTime();
$formattedDate = $date->format('Y-m-d\TH:i:s');
file_put_contents($logfile, "=== Deploy @ " . $formattedDate . " ===\n", FILE_APPEND);

// exec commands
$output = '';
foreach ($commands as $command) {
  // $tmp = shell_exec($command);
  // Print any errors also
  $tmp = shell_exec("$command 2>&1");
  file_put_contents($logfile, "\$ $command\n$tmp\n", FILE_APPEND);

  $output .= "<span class='prompt'>\$</span><span class='command'>{$command}\n</span><br>";
  $output .= htmlentities(trim($tmp)) . "\n<br><br>";
}
?>

<!DOCTYPE HTML>
<html lang="en-US">

<head>
  <meta charset="UTF-8">
  <title>GIT DEPLOYMENT SCRIPT</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 2rem;
    }

    .card {
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      padding: 1rem;
    }

    .prompt {
      color: #48a71c;
    }

    .command {
      color: #1c61aa;
    }
  </style>
</head>

<body>
  <div class="card">
    <p>Git Deployment Script</p>
    <?php echo $output; ?>
  </div>
</body>

</html>