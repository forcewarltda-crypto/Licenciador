# PowerShell 5.1 ou superior, Windows. Publicar como texto, sem HTML.
# Preencha os dois valores abaixo antes de distribuir o comando.
& {
    $ErrorActionPreference = 'Stop'
    $ExecutableUrl = 'https://github.com/forcewarltda-crypto/Ativador-.exe/releases/download/v5.0/Ativador.exe'
    $ExpectedSha256 = '35FEF7E232DD83366236552305B52040EDAAB70A6C5DA5C96932EC97DC2B00FD'

    if ([string]::IsNullOrWhiteSpace($ExecutableUrl) -or
        $ExpectedSha256 -notmatch '\A[0-9a-fA-F]{64}\z') {
        throw 'Instalador ainda nao configurado: falta a URL HTTPS ou o SHA-256 do executavel. Contate o suporte.'
    }
    $downloadUri = $null
    if (-not [Uri]::TryCreate($ExecutableUrl, [UriKind]::Absolute, [ref]$downloadUri) -or
        $downloadUri.Scheme -ne 'https' -or $downloadUri.UserInfo) {
        throw 'A URL do executavel deve usar HTTPS e nao pode conter credenciais.'
    }
    if ($env:OS -ne 'Windows_NT' -or $PSVersionTable.PSVersion -lt [version]'5.1') {
        throw 'Use o PowerShell 5.1 ou superior no Windows.'
    }

    $previousTls = [Net.ServicePointManager]::SecurityProtocol
    $partialPath = $null
    try {
        [Net.ServicePointManager]::SecurityProtocol = $previousTls -bor [Net.SecurityProtocolType]::Tls12
        $downloadDirectory = Join-Path ([IO.Path]::GetTempPath()) ('ForceWar-Download-' + [Guid]::NewGuid().ToString('N'))
        $null = New-Item -ItemType Directory -Path $downloadDirectory -ErrorAction Stop
        $partialPath = Join-Path $downloadDirectory 'Executor.exe.part'
        $executablePath = Join-Path $downloadDirectory 'Executor.exe'

        Write-Host 'Baixando o Executor...'
        Invoke-WebRequest -Uri $downloadUri.AbsoluteUri -OutFile $partialPath -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 300 -ErrorAction Stop
        Write-Host 'Conferindo a integridade do arquivo...'
        $actualHash = (Get-FileHash -LiteralPath $partialPath -Algorithm SHA256 -ErrorAction Stop).Hash
        if ($actualHash -ine $ExpectedSha256) {
            throw 'SHA-256 divergente. O arquivo nao sera executado. Contate o suporte.'
        }

        Move-Item -LiteralPath $partialPath -Destination $executablePath -ErrorAction Stop
        # Preserva a identificacao de arquivo obtido da Internet para o Windows.
        Set-Content -LiteralPath $executablePath -Stream Zone.Identifier -Value "[ZoneTransfer]`r`nZoneId=3" -Encoding ASCII -ErrorAction Stop
        Write-Host 'Arquivo verificado. Confirme a solicitacao de administrador do Windows.'
        try {
            $started = Start-Process -FilePath $executablePath -WorkingDirectory $downloadDirectory -Verb RunAs -PassThru -ErrorAction Stop
        }
        catch {
            throw 'O Windows nao iniciou o Executor. A solicitacao pode ter sido cancelada ou o arquivo bloqueado. Nenhuma protecao foi alterada.'
        }
        Write-Host ('Solicitacao de abertura enviada. Arquivo: ' + $executablePath)
        Write-Host 'Acompanhe a conclusao na janela do Executor.'
    }
    finally {
        [Net.ServicePointManager]::SecurityProtocol = $previousTls
        # Remove somente o download parcial desta tentativa; nunca pastas recursivamente.
        if ($partialPath -and (Test-Path -LiteralPath $partialPath -PathType Leaf)) {
            Remove-Item -LiteralPath $partialPath -Force -ErrorAction SilentlyContinue
        }
    }
}
