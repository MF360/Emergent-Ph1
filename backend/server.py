from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import io
import csv
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.units import inch
# from emergentintegrations.llm.chat import LlmChat, UserMessage
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "drmf_secret_key_change_in_production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    hashed_password: str # Added this line
    role: str = "MFD"
    subscription_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Investor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    investor_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    arn: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    dob: str
    kyc_status: str
    pan: str
    address: str
    city: str
    state: str
    pincode: str
    folio_ids: List[str] = []
    risk_profile: str
    amt_aum: float
    preferred_contact: str
    notes: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InvestorCreate(BaseModel):
    arn: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    dob: str
    kyc_status: str
    pan: str
    address: str
    city: str
    state: str
    pincode: str
    folio_ids: List[str] = []
    risk_profile: str
    amt_aum: float
    preferred_contact: str
    notes: str = ""

class InvestorUpdate(BaseModel):
    arn: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    kyc_status: Optional[str] = None
    pan: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    folio_ids: Optional[List[str]] = None
    risk_profile: Optional[str] = None
    amt_aum: Optional[float] = None
    preferred_contact: Optional[str] = None
    notes: Optional[str] = None

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    transaction_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    investor_id: str
    date: str
    folio_id: str
    scheme: str
    type: str
    amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnalysisRequest(BaseModel):
    investor_ids: List[str]
    analysis_type: str
    use_live_ai: bool = False

class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    analysis_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    investor_ids: List[str]
    analysis_type: str
    executive_summary: str
    action_items: List[str]
    risk_alerts: List[str]
    details: Dict[str, Any]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FeatureFlags(BaseModel):
    use_live_ai: bool = False
    allow_csv_import: bool = True

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# Utility functions
def hash_password(password: str) -> str:
    # Truncate password to 72 characters before hashing
    truncated_password = password[:72]
    return pwd_context.hash(truncated_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Seed data generator
async def generate_seed_investors():
    count = await db.investors.count_documents({})
    if count > 0:
        return
    
    indian_cities = [
        ("Mumbai", "Maharashtra"), ("Delhi", "Delhi"), ("Bangalore", "Karnataka"),
        ("Hyderabad", "Telangana"), ("Chennai", "Tamil Nadu"), ("Kolkata", "West Bengal"),
        ("Pune", "Maharashtra"), ("Ahmedabad", "Gujarat"), ("Jaipur", "Rajasthan"),
        ("Surat", "Gujarat")
    ]
    
    first_names = ["Amit", "Priya", "Rahul", "Sneha", "Vijay", "Anjali", "Sanjay", "Pooja", "Rajesh", "Kavita"]
    last_names = ["Sharma", "Patel", "Kumar", "Singh", "Reddy", "Gupta", "Joshi", "Mehta", "Nair", "Desai"]
    
    investors_data = []
    for i in range(50):
        city, state = random.choice(indian_cities)
        investor = {
            "investor_id": str(uuid.uuid4()),
            "arn": f"ARN-{random.randint(100000, 999999)}",
            "first_name": random.choice(first_names),
            "last_name": random.choice(last_names),
            "email": f"investor{i+1}@example.com",
            "phone": f"+91{random.randint(7000000000, 9999999999)}",
            "dob": f"{random.randint(1960, 2000)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
            "kyc_status": random.choice(["Y", "Y", "Y", "N"]),
            "pan": f"{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}{random.randint(1000, 9999)}{chr(random.randint(65, 90))}",
            "address": f"{random.randint(1, 999)} MG Road",
            "city": city,
            "state": state,
            "pincode": f"{random.randint(100000, 999999)}",
            "folio_ids": [f"FOL{random.randint(10000, 99999)}" for _ in range(random.randint(1, 4))],
            "risk_profile": random.choice(["Low", "Medium", "High", "Unknown"]),
            "amt_aum": round(random.uniform(50000, 5000000), 2),
            "preferred_contact": random.choice(["email", "phone", "whatsapp"]),
            "notes": f"Client since {random.randint(2015, 2023)}",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        investors_data.append(investor)
    
    if investors_data:
        await db.investors.insert_many(investors_data)

# Authentication Routes
@api_router.post("/auth/signup")
async def signup(user_data: UserCreate):
    logger.info(f"Signup attempt for email: {user_data.email}")
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        logger.warning(f"Signup failed: Email {user_data.email} already registered")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        hashed_password = hash_password(user_data.password)
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password
        )
        
        user_dict = user.model_dump()
        user_dict["created_at"] = user_dict["created_at"].isoformat()
        
        await db.users.insert_one(user_dict)
        
        await generate_seed_investors()
        
        token = create_access_token({"sub": user.id})
        logger.info(f"User {user.email} signed up successfully.")
        return {"user": user, "token": token}
    except Exception as e:
        logger.error(f"Error during signup for {user_data.email}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_obj = User(**user)
    token = create_access_token({"sub": user_obj.id})
    return {"user": user_obj, "token": token}

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.post("/auth/forgot-password")
async def forgot_password(data: PasswordReset):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user:
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Mock: In production, send email with reset token
    reset_token = str(uuid.uuid4())
    logger.info(f"Password reset token for {data.email}: {reset_token}")
    
    return {"message": "If the email exists, a reset link has been sent", "mock_token": reset_token}

@api_router.post("/auth/reset-password")
async def reset_password(data: PasswordResetConfirm):
    # Mock: In production, validate token and update password
    logger.info(f"Password reset attempted with token: {data.token}")
    return {"message": "Password has been reset successfully (mock)"}

# Investor Routes
@api_router.get("/investors", response_model=List[Investor])
async def get_investors(
    search: Optional[str] = None,
    kyc_status: Optional[str] = None,
    risk_profile: Optional[str] = None,
    city: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    query = {}
    
    if search:
        query["$or"] = [
            {"first_name": {"$regex": search, "$options": "i"}},
            {"last_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"arn": {"$regex": search, "$options": "i"}},
            {"pan": {"$regex": search, "$options": "i"}}
        ]
    
    if kyc_status:
        query["kyc_status"] = kyc_status
    if risk_profile:
        query["risk_profile"] = risk_profile
    if city:
        query["city"] = city
    
    investors = await db.investors.find(query, {"_id": 0}).to_list(1000)
    
    for investor in investors:
        if isinstance(investor.get('created_at'), str):
            investor['created_at'] = datetime.fromisoformat(investor['created_at'])
        if isinstance(investor.get('updated_at'), str):
            investor['updated_at'] = datetime.fromisoformat(investor['updated_at'])
    
    return investors

@api_router.get("/investors/{investor_id}", response_model=Investor)
async def get_investor(investor_id: str, current_user: User = Depends(get_current_user)):
    investor = await db.investors.find_one({"investor_id": investor_id}, {"_id": 0})
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    if isinstance(investor.get('created_at'), str):
        investor['created_at'] = datetime.fromisoformat(investor['created_at'])
    if isinstance(investor.get('updated_at'), str):
        investor['updated_at'] = datetime.fromisoformat(investor['updated_at'])
    
    return Investor(**investor)

@api_router.post("/investors", response_model=Investor)
async def create_investor(investor_data: InvestorCreate, current_user: User = Depends(get_current_user)):
    investor = Investor(**investor_data.model_dump())
    investor_dict = investor.model_dump()
    investor_dict["created_at"] = investor_dict["created_at"].isoformat()
    investor_dict["updated_at"] = investor_dict["updated_at"].isoformat()
    
    await db.investors.insert_one(investor_dict)
    return investor

@api_router.put("/investors/{investor_id}", response_model=Investor)
async def update_investor(
    investor_id: str,
    update_data: InvestorUpdate,
    current_user: User = Depends(get_current_user)
):
    investor = await db.investors.find_one({"investor_id": investor_id}, {"_id": 0})
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.investors.update_one({"investor_id": investor_id}, {"$set": update_dict})
    
    updated_investor = await db.investors.find_one({"investor_id": investor_id}, {"_id": 0})
    if isinstance(updated_investor.get('created_at'), str):
        updated_investor['created_at'] = datetime.fromisoformat(updated_investor['created_at'])
    if isinstance(updated_investor.get('updated_at'), str):
        updated_investor['updated_at'] = datetime.fromisoformat(updated_investor['updated_at'])
    
    return Investor(**updated_investor)

@api_router.delete("/investors/{investor_id}")
async def delete_investor(investor_id: str, current_user: User = Depends(get_current_user)):
    result = await db.investors.delete_one({"investor_id": investor_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Investor not found")
    return {"message": "Investor deleted successfully"}

@api_router.get("/investors/csv-template/download")
async def download_csv_template():
    output = io.StringIO()
    writer = csv.writer(output)
    
    headers = [
        "arn", "first_name", "last_name", "email", "phone", "dob", "kyc_status",
        "pan", "address", "city", "state", "pincode", "folio_ids", "risk_profile",
        "amt_aum", "preferred_contact", "notes"
    ]
    writer.writerow(headers)
    
    # Sample data
    writer.writerow([
        "ARN-123456", "Amit", "Sharma", "amit@example.com", "+919876543210",
        "1985-05-15", "Y", "ABCDE1234F", "123 MG Road", "Mumbai", "Maharashtra",
        "400001", "FOL12345,FOL67890", "Medium", "500000", "email", "VIP Client"
    ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=investor_template.csv"}
    )

@api_router.post("/investors/import-csv")
async def import_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        contents = await file.read()
        decoded = contents.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(decoded))
        
        imported_count = 0
        errors = []
        
        for row_num, row in enumerate(csv_reader, start=2):
            try:
                folio_ids = [f.strip() for f in row.get('folio_ids', '').split(',') if f.strip()]
                
                investor_data = InvestorCreate(
                    arn=row['arn'],
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    email=row['email'],
                    phone=row['phone'],
                    dob=row['dob'],
                    kyc_status=row['kyc_status'],
                    pan=row['pan'],
                    address=row['address'],
                    city=row['city'],
                    state=row['state'],
                    pincode=row['pincode'],
                    folio_ids=folio_ids,
                    risk_profile=row['risk_profile'],
                    amt_aum=float(row['amt_aum']),
                    preferred_contact=row['preferred_contact'],
                    notes=row.get('notes', '')
                )
                
                investor = Investor(**investor_data.model_dump())
                investor_dict = investor.model_dump()
                investor_dict["created_at"] = investor_dict["created_at"].isoformat()
                investor_dict["updated_at"] = investor_dict["updated_at"].isoformat()
                
                await db.investors.insert_one(investor_dict)
                imported_count += 1
            except Exception as e:
                errors.append({"row": row_num, "error": str(e)})
        
        return {
            "message": f"Successfully imported {imported_count} investors",
            "imported_count": imported_count,
            "errors": errors
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

# AI Analysis Routes
async def run_mock_analysis(analysis_type: str, investors: List[dict]) -> AnalysisResult:
    if analysis_type == "risk_summary":
        high_risk_count = sum(1 for inv in investors if inv.get("risk_profile") == "High")
        no_kyc_count = sum(1 for inv in investors if inv.get("kyc_status") == "N")
        
        executive_summary = f"Analyzed {len(investors)} investor(s). {high_risk_count} are high-risk profile. {no_kyc_count} have incomplete KYC."
        
        action_items = [
            "Complete KYC for all pending investors",
            "Review high-risk portfolios for rebalancing opportunities",
            "Schedule quarterly review meetings with high-AUM clients"
        ]
        
        risk_alerts = []
        if no_kyc_count > 0:
            risk_alerts.append(f"{no_kyc_count} investor(s) have incomplete KYC - regulatory compliance issue")
        if high_risk_count > len(investors) * 0.5:
            risk_alerts.append("Over 50% of analyzed investors have high-risk profiles")
        
        return AnalysisResult(
            investor_ids=[inv["investor_id"] for inv in investors],
            analysis_type=analysis_type,
            executive_summary=executive_summary,
            action_items=action_items,
            risk_alerts=risk_alerts,
            details={
                "total_investors": len(investors),
                "high_risk_count": high_risk_count,
                "no_kyc_count": no_kyc_count,
                "total_aum": sum(inv.get("amt_aum", 0) for inv in investors)
            }
        )
    
    elif analysis_type == "allocation_check":
        total_aum = sum(inv.get("amt_aum", 0) for inv in investors)
        avg_aum = total_aum / len(investors) if investors else 0
        
        executive_summary = f"Portfolio allocation analysis for {len(investors)} investor(s). Total AUM: ₹{total_aum:,.2f}. Average AUM: ₹{avg_aum:,.2f}."
        
        action_items = [
            "Diversify portfolios with less than 3 folios",
            "Review allocation for investors with AUM > ₹1 Cr",
            "Consider SIP recommendations for low-AUM clients"
        ]
        
        risk_alerts = []
        low_folio_count = sum(1 for inv in investors if len(inv.get("folio_ids", [])) < 2)
        if low_folio_count > 0:
            risk_alerts.append(f"{low_folio_count} investor(s) have limited diversification (< 2 folios)")
        
        return AnalysisResult(
            investor_ids=[inv["investor_id"] for inv in investors],
            analysis_type=analysis_type,
            executive_summary=executive_summary,
            action_items=action_items,
            risk_alerts=risk_alerts,
            details={
                "total_investors": len(investors),
                "total_aum": total_aum,
                "average_aum": avg_aum,
                "low_diversification_count": low_folio_count
            }
        )
    
    return AnalysisResult(
        investor_ids=[inv["investor_id"] for inv in investors],
        analysis_type=analysis_type,
        executive_summary="Analysis type not supported",
        action_items=[],
        risk_alerts=[],
        details={}
    )

async def run_live_analysis(analysis_type: str, investors: List[dict]) -> AnalysisResult:
    try:
        api_key = os.getenv("EMERGENT_LLM_KEY")
        if not api_key:
            raise Exception("EMERGENT_LLM_KEY not found")
        
        # chat = LlmChat(
        #     api_key=api_key,
        #     session_id=f"analysis_{uuid.uuid4()}",
        #     system_message="You are an expert financial analyst specializing in mutual fund portfolio analysis for Indian investors."
        # ).with_model("openai", "gpt-4o-mini")
        
        investor_summary = "\n".join([
            f"- {inv['first_name']} {inv['last_name']}: Risk Profile: {inv['risk_profile']}, AUM: ₹{inv['amt_aum']:,.2f}, KYC: {inv['kyc_status']}, Folios: {len(inv.get('folio_ids', []))}"
            for inv in investors[:10]
        ])
        
        if analysis_type == "risk_summary":
            prompt = f"""Analyze the following investors and provide:
1. Executive Summary (2-3 sentences)
2. Top 3 Action Items
3. Risk Alerts (if any)

Investors:
{investor_summary}

Provide the response in JSON format with keys: executive_summary, action_items (array), risk_alerts (array)."""
        
        elif analysis_type == "allocation_check":
            prompt = f"""Analyze the portfolio allocation for the following investors and provide:
1. Executive Summary (2-3 sentences)
2. Top 3 Action Items for better allocation
3. Risk Alerts regarding concentration (if any)

Investors:
{investor_summary}

Provide the response in JSON format with keys: executive_summary, action_items (array), risk_alerts (array)."""
        else:
            prompt = f"Analyze these investors: {investor_summary}"
        
        # user_message = UserMessage(text=prompt) # This line was commented out in the original file
        # response = await chat.send_message(user_message) # This line was commented out in the original file
        
        # Mock response for live AI
        import json
        try:
            result = json.loads(prompt) # Mock parsing for demonstration
        except:
            result = {
                "executive_summary": "Analysis completed (mock)",
                "action_items": ["Review generated analysis", "Follow up with clients"],
                "risk_alerts": []
            }
        
        return AnalysisResult(
            investor_ids=[inv["investor_id"] for inv in investors],
            analysis_type=analysis_type,
            executive_summary=result.get("executive_summary", "Analysis completed"),
            action_items=result.get("action_items", []),
            risk_alerts=result.get("risk_alerts", []),
            details={
                "total_investors": len(investors),
                "ai_generated": True
            }
        )
    except Exception as e:
        logger.error(f"Error in live AI analysis: {str(e)}")
        return await run_mock_analysis(analysis_type, investors)

@api_router.post("/analysis/run", response_model=AnalysisResult)
async def run_analysis(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    investors = await db.investors.find(
        {"investor_id": {"$in": request.investor_ids}},
        {"_id": 0}
    ).to_list(1000)
    
    if not investors:
        raise HTTPException(status_code=404, detail="No investors found")
    
    if request.use_live_ai:
        result = await run_live_analysis(request.analysis_type, investors)
    else:
        result = await run_mock_analysis(request.analysis_type, investors)
    
    # Save analysis
    result_dict = result.model_dump()
    result_dict["created_at"] = result_dict["created_at"].isoformat()
    await db.analyses.insert_one(result_dict)
    
    return result

@api_router.get("/analysis/history", response_model=List[AnalysisResult])
async def get_analysis_history(current_user: User = Depends(get_current_user)):
    analyses = await db.analyses.find({}, {"_id": 0}).sort("created_at", -1).limit(50).to_list(50)
    
    for analysis in analyses:
        if isinstance(analysis.get('created_at'), str):
            analysis['created_at'] = datetime.fromisoformat(analysis['created_at'])
    
    return analyses

@api_router.get("/analysis/report/{analysis_id}/pdf")
async def download_analysis_pdf(
    analysis_id: str,
    current_user: User = Depends(get_current_user)
):
    analysis = await db.analyses.find_one({"analysis_id": analysis_id}, {"_id": 0})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=30
    )
    elements.append(Paragraph(f"AI Analysis Report", title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Analysis Details
    elements.append(Paragraph(f"<b>Analysis Type:</b> {analysis['analysis_type']}", styles['Normal']))
    elements.append(Paragraph(f"<b>Date:</b> {analysis.get('created_at', 'N/A')}", styles['Normal']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Executive Summary
    elements.append(Paragraph("<b>Executive Summary</b>", styles['Heading2']))
    elements.append(Paragraph(analysis['executive_summary'], styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    # Action Items
    elements.append(Paragraph("<b>Action Items</b>", styles['Heading2']))
    for item in analysis['action_items']:
        elements.append(Paragraph(f"• {item}", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    # Risk Alerts
    if analysis.get('risk_alerts'):
        elements.append(Paragraph("<b>Risk Alerts</b>", styles['Heading2']))
        for alert in analysis['risk_alerts']:
            elements.append(Paragraph(f"⚠️ {alert}", styles['Normal']))
    
    doc.build(elements)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=analysis_{analysis_id}.pdf"}
    )

# Settings Routes
@api_router.get("/settings/feature-flags", response_model=FeatureFlags)
async def get_feature_flags(current_user: User = Depends(get_current_user)):
    flags = await db.settings.find_one({"type": "feature_flags"}, {"_id": 0})
    if not flags:
        default_flags = FeatureFlags()
        await db.settings.insert_one({"type": "feature_flags", **default_flags.model_dump()})
        return default_flags
    return FeatureFlags(**flags)

@api_router.put("/settings/feature-flags", response_model=FeatureFlags)
async def update_feature_flags(
    flags: FeatureFlags,
    current_user: User = Depends(get_current_user)
):
    await db.settings.update_one(
        {"type": "feature_flags"},
        {"$set": flags.model_dump()},
        upsert=True
    )
    return flags

@api_router.post("/settings/reseed-data")
async def reseed_data(current_user: User = Depends(get_current_user)):
    await db.investors.delete_many({})
    await generate_seed_investors()
    return {"message": "Seed data regenerated successfully"}

# Dashboard Stats
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    total_investors = await db.investors.count_documents({})
    kyc_pending = await db.investors.count_documents({"kyc_status": "N"})
    
    pipeline = [
        {"$group": {"_id": None, "total_aum": {"$sum": "$amt_aum"}}}
    ]
    aum_result = await db.investors.aggregate(pipeline).to_list(1)
    total_aum = aum_result[0]["total_aum"] if aum_result else 0
    
    recent_analyses = await db.analyses.count_documents({})
    
    return {
        "total_investors": total_investors,
        "kyc_pending": kyc_pending,
        "total_aum": total_aum,
        "recent_analyses": recent_analyses
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()