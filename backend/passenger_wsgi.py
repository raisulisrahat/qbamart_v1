import os
import sys

# Add project root directory to Python search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set path to AppDynamics configuration file for Passenger
os.environ.setdefault('APPD_CONFIG_FILE', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'appdynamics.cfg'))

# Import Django WSGI application
from core.wsgi import application
