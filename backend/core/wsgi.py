"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

try:
    import appdynamics.agent
    cfg_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'appdynamics.cfg')
    if os.path.exists(cfg_file):
        appdynamics.agent.init(cfg_file)
    else:
        appdynamics.agent.init()
except ImportError:
    pass
except Exception as e:
    print(f"AppDynamics agent initialization warning: {e}")

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()
