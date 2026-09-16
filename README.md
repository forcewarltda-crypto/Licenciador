# Instalador ForceWar

Bootstrap PowerShell para Windows. Baixa o executavel por HTTPS, compara o
SHA-256 configurado e solicita abertura como administrador pelo Windows.
Nao modifica o Defender, nao remove a marca de origem da Internet e nao
altera a politica de execucao do PowerShell.

## Configuracao obrigatoria

O script entregue esta desabilitado por falta da URL e do hash. Nao existe
executavel incorporado neste pacote.

1. Publique o EXE escolhido em um GitHub Release.
2. Calcule o hash do arquivo original que voce publicou:

   ```powershell
   Get-FileHash -LiteralPath 'C:\caminho\Executor.exe' -Algorithm SHA256
   ```

3. Edite `install.ps1`, preenchendo `$ExecutableUrl` com o link HTTPS direto
   do asset e `$ExpectedSha256` com os 64 caracteres do hash, entre aspas simples.
   Use uma URL de release especifica. Atualize URL e hash juntos a cada versao.
4. Suba o conteudo desta pasta na raiz do repositorio
   `forcewarltda-crypto/Licenciador`. Preserve os arquivos existentes.
5. No GitHub Pages, use a branch `main` e a pasta `/`.

## Dominio e comando

O arquivo CNAME configura `keysteam.com.br`. O dominio tambem precisa apontar
para o GitHub Pages no painel DNS. Aguarde a validacao e habilite HTTPS.

Somente depois de configurar URL/hash e concluir a publicacao HTTPS:

```powershell
irm https://keysteam.com.br/install.ps1 | iex
```

Antes de configurar um dominio personalizado, o endereco padrao do projeto e:

```powershell
irm https://forcewarltda-crypto.github.io/Licenciador/install.ps1 | iex
```

Para usar somente o endereco padrao inicialmente, nao envie o CNAME e deixe
o dominio personalizado vazio em Settings > Pages. Com o dominio configurado,
o GitHub pode redirecionar o endereco padrao para ele.

Use `/install.ps1`, incluindo a extensao. Nao foi criada uma rota `/install`.
O comando executa o conteudo publicado nesse endereco: mantenha o repositorio
e o dominio sob seu controle e revise o script antes de distribui-lo.

## Comportamento

- Configuracao ausente ou invalida: interrompe antes de baixar.
- Download interrompido ou hash diferente: nao inicia o arquivo.
- Solicitacao de administrador recusada ou bloqueio: informa falha, sem alterar protecoes.
- Arquivo verificado: mantido em uma pasta temporaria exclusiva por tentativa.
- Abrir o processo nao significa que a instalacao terminou com sucesso.

A verificacao de hash confirma que o download corresponde ao arquivo escolhido;
nao certifica a seguranca nem o comportamento interno desse executavel.

## Referencias

- https://learn.microsoft.com/powershell/module/microsoft.powershell.utility/get-filehash
- https://learn.microsoft.com/powershell/module/microsoft.powershell.management/start-process
- https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
