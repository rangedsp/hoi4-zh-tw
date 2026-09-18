
$TargetDir = "./english"
$OldString = "l_simp_chinese"
$NewString = "l_english"

# 2. Run the find and replace operation
Write-Host "Searching for '$OldString' in '$TargetDir'..."

# Get all files recursively and replace content
Get-ChildItem -Path $TargetDir -File -Recurse | ForEach-Object {
    (Get-Content -Path $_.FullName -Raw) -replace $OldString, $NewString | 
    Set-Content -Path $_.FullName -Encoding utf8
}

Write-Host "🎉 Done! Replacements complete across all files."