"""
Landmark math and geometry utilities for MediaPipe 3D keypoints.
"""

import math
from typing import Dict, List, Tuple
from ...schemas.gesture import Vector3D, HeadOrientation

def calculate_distance_3d(v1: Vector3D, v2: Vector3D) -> float:
    return math.sqrt((v1.x - v2.x)**2 + (v1.y - v2.y)**2 + (v1.z - v2.z)**2)

def calculate_angle(v1: Vector3D, v2: Vector3D, v3: Vector3D) -> float:
    """Calculate angle at joint v2 between v1-v2 and v3-v2 in degrees."""
    v21 = Vector3D(x=v1.x - v2.x, y=v1.y - v2.y, z=v1.z - v2.z)
    v23 = Vector3D(x=v3.x - v2.x, y=v3.y - v2.y, z=v3.z - v2.z)
    
    dot = v21.x * v23.x + v21.y * v23.y + v21.z * v23.z
    mag1 = math.sqrt(v21.x**2 + v21.y**2 + v21.z**2)
    mag2 = math.sqrt(v23.x**2 + v23.y**2 + v23.z**2)
    
    if mag1 * mag2 == 0:
        return 0.0
    cos_angle = max(-1.0, min(1.0, dot / (mag1 * mag2)))
    return math.degrees(math.acos(cos_angle))
