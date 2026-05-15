# Google Cloud System Runtime Simulator for Antigravity Compliance
import json

def process_threat_analytics(event_message):
    # Content Understanding Filter Check
    has_urgency = "immediate" in event_message.lower() or "blocked" in event_message.lower()
    has_otp = "otp" in event_message.lower() or "code" in event_message.lower()
    
    # Non-Trivial Risk Weight Logic
    calculated_risk = (int(has_urgency) * 45) + (int(has_otp) * 49)
    
    before_state = {"firewall": "ALLOW_ALL"}
    after_state = {"firewall": "AI_SHIELD_ACTIVE" if calculated_risk >= 85 else "ALLOW_ALL"}
    
    return {
        "calculated_percentage": calculated_risk if calculated_risk > 0 else 12,
        "state_delta": {"before": before_state, "after": after_state},
        "logs": [
            "[LOG] CyberSignalExtractor identified active patterns.",
            f"[LOG] TacticalDefenseEngine computed total hazard scale: {calculated_risk}%.",
            f"[LOG] AutomatedRemediationClient updated security rule state to {after_state['firewall']}."
        ]
    }
