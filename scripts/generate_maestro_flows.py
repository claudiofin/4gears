import os
import json

def generate_maestro_flows(config, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Team Navigation Flow (Base)
    navigation_flow = """appId: ${APP_ID}
---
- launchApp
- assertVisible: "Home"
"""
    
    # 2. Add dynamic sections based on features
    features = config.get('features', {})
    
    if features.get('shop', True):
        shop_flow = """appId: ${APP_ID}
---
- launchApp
- tapOn: "Shop"
- assertVisible: "Prodotti"
- tapOn: "Main Sponsor" # Example product
- tapOn: "AGGIUNGI AL CARRELLO"
- assertVisible: "1" # Cart count
"""
        with open(os.path.join(output_dir, 'shop-flow.yaml'), 'w') as f:
            f.write(shop_flow)
            
    if features.get('roster', False):
        roster_flow = """appId: ${APP_ID}
---
- launchApp
- tapOn: "Roster"
- assertVisible: "Atleti"
- tapOn: "Alessandro Rossi"
- assertVisible: "Statistiche"
"""
        with open(os.path.join(output_dir, 'roster-flow.yaml'), 'w') as f:
            f.write(roster_flow)

    # Global navigation flow
    with open(os.path.join(output_dir, 'navigation-flow.yaml'), 'w') as f:
        f.write(navigation_flow)

    print(f"✅ Maestro flows generated in {output_dir}")

if __name__ == "__main__":
    # Mock config for testing
    mock_config = {
        "features": {
            "shop": True,
            "roster": True,
            "events": True
        }
    }
    generate_maestro_flows(mock_config, "./handover_output/maestro")
