from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class UserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'display_name', 'icon', 'header')}),
        ('個人情報', {'fields': ('email', 'password')}),
        ('プロフィール', {'fields': ('bio', 'location', 'website', 'birth_date')}),
        ('日付', {'fields': ('last_login', 'date_joined')}),
        ('権限', {
            'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )
    list_display = ('username', 'email', 'is_staff')
    search_fields = ('username', 'email')
    readonly_fields = ('last_login', 'date_joined')
