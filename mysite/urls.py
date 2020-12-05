"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from mysite.views import *
from . import views
from django.conf.urls.static import static

urlpatterns = [
    path('', StartPage.as_view(), name='log_in'),
    path('home/', Home.as_view(), name="home"),
    path('home/ajax', views.home_ajax, name="home_ajax"),
    path('setting/', SettingFunc.as_view(), name="setting"),
    path('gallery/', views.gallery, name="gallery"),
    path('post/new/', views.post_new, name='post_new'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
    path('post/<int:pk>/edit/', views.post_edit, name='post_edit'),
    path('post/<int:pk>/delete/', views.post_delete, name='post_delete'),
    path('goal/add/', views.add_goal, name='add_goal'),
    path('goal/delete/', views.delete_goal, name='delete_goal'),
    path('goal/edit/', views.edit_goal, name='edit_goal'),
    path('accounts/', include('allauth.urls')),
    path('logout/', views.logout_view, name='logout'),
    path('admin/', admin.site.urls),
] + static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS) +\
              static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
