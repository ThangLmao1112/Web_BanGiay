# Test login API
$uri = "http://localhost:8080/api/users/login"
$body = @{
    email = "thangdemo01@gmail.com"
    password = "12345678"
} | ConvertTo-Json

Write-Host "Testing POST $uri"
Write-Host "Body: $body"

try {
    $response = Invoke-RestMethod -Method Post `
        -Uri $uri `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json)
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
