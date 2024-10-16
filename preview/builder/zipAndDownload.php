<?php
    if (isset($_GET["filepath"])) {
        
        $zipName = $_GET["filepath"] . '.zip';
        
        if (file_exists($zipName)) {
            unlink($zipName);
        }
        
        $zip = Zip($_GET["filepath"], $zipName);
        
        header('Content-Type: application/zip');
        header("Content-Disposition: attachment; filename='" . $zipname . "'");
        header('Content-Length: ' . filesize($zipname));
        header("Location: " . $zipName);
        
    } else {
        echo 'ERROR: ZIP name not provided';
    }



    function Zip($source, $destination) {
        if (!extension_loaded('zip') || !file_exists($source)) {
            return false;
        }

        $zip = new ZipArchive();
        if (!$zip->open($destination, ZIPARCHIVE::CREATE)) {
            return false;
        }
        
        $fileName = substr( $source , strrpos($source, '/') + 1) . '/';
        $zip->addEmptyDir($fileName);

        $source = str_replace('\\', '/', realpath($source));

        if (is_dir($source) === true)
        {
            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);

            foreach ($files as $file)
            {
                $file = str_replace('\\', '/', $file);

                // Ignore "." and ".." folders
                if( in_array(substr($file, strrpos($file, '/')+1), array('.', '..')) )
                    continue;

                $file = realpath($file);

                if (is_dir($file) === true)
                {
                    $zip->addEmptyDir($fileName . str_replace($source . '/', '', $file . '/'));
                }
                else if (is_file($file) === true)
                {
                    $zip->addFromString($fileName . str_replace($source . '/', '', $file), file_get_contents($file));
                }
            }
        }
        else if (is_file($source) === true)
        {
            $zip->addFromString($fileName . basename($source), file_get_contents($source));
        }

        return $zip->close();
    }
?>