from django.contrib import admin

from . import models


# Register your models here.
@admin.register(models.Tweet)
class TweetAdmin(admin.ModelAdmin):
    list_display = ("user", "message", "created_at")
    search_fields = ("user", "message")
    list_filter = ("created_at",)


admin.site.register(models.Media)
admin.site.register(models.Like)
admin.site.register(models.Retweet)
admin.site.register(models.QuoteTweet)
