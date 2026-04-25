#!/bin/bash

# Configuration
BASE_URL="http://localhost:3001/api"
HEADER="Content-Type: application/json"

echo "--- 🚀 STARTING API TESTS ---"

# 1. TEST CONTACT
echo -e "\n[1] Testing /api/contact..."
curl -X POST "$BASE_URL/contact" \
     -H "$HEADER" \
     -d '{"name": "Test User", "email": "test@example.com", "message": "Ceci est un message de test sécurisé."}'
echo -e "\n[1.1] Testing 405 Method Not Allowed..."
curl -X GET "$BASE_URL/contact"

# 2. TEST NEWSLETTER
echo -e "\n\n[2] Testing /api/newsletter..."
curl -X POST "$BASE_URL/newsletter" \
     -H "$HEADER" \
     -d '{"email": "newsletter@test.sn"}'

# 3. TEST DEVIS
echo -e "\n\n[3] Testing /api/devis..."
curl -X POST "$BASE_URL/devis" \
     -H "$HEADER" \
     -d '{"name": "Entreprise STS", "email": "devis@sts.sn", "service": "Agrobusiness", "message": "Demande de partenariat agro."}'

# 4. TEST RESERVATION
echo -e "\n\n[4] Testing /api/reservation..."
curl -X POST "$BASE_URL/reservation" \
     -H "$HEADER" \
     -d '{
       "name": "Moussa Diop", 
       "email": "moussa@test.sn", 
       "phone": "771234567", 
       "vehicleId": "v123", 
       "vehicleName": "Berline Deluxe", 
       "startDate": "2026-05-01", 
       "endDate": "2026-05-05", 
       "pickup": "Dakar", 
       "destination": "Thiès", 
       "totalPrice": 150000
     }'

echo -e "\n\n--- ✅ TESTS COMPLETED ---"
