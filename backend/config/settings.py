# config/settings.py
import os

# ==========================================
# RECEPTIVE API ENVIRONMENT
# ==========================================
OPENF1_BASE_URL = "https://api.openf1.org/v1"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Backup connection toggle
SIMULATION_MODE = False

# ==========================================
# DEFAULT COLORS & PALETTE ACCENTS
# ==========================================
APEX_THEME = {
    "bg_dark": "#070a13",
    "card_dark": "rgba(10, 15, 33, 0.85)",
    "border_cyan": "rgba(0, 210, 190, 0.3)",
    "accent_green": "#00D2BE",
    "accent_red": "#E10600",
    "accent_orange": "#FF8000",
    "accent_blue": "#3671C6",
    "text_white": "#F8FAFC",
    "text_gray": "#94A3B8"
}
