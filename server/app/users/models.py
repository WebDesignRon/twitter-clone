import uuid as uuid_lib

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, UserManager
from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from django.utils.deconstruct import deconstructible


@deconstructible
class UsernameValidator(RegexValidator):
    regex = r"^[\w_]+$"
    message = "英数字と'_'のみが使用できます。"
    flags = 0


class hogeUserManager(BaseUserManager):
    def create_user(self, **extra_data):
        user = self.model(self, **extra_data)
        user.set_password(extra_data["password"])
        user.save(using=self._db)

        return user

    def create_user_with_email(self, email, password, **extra_data):
        email = self.normalize_email(email)
        user = self.model(self, email=email, **extra_data)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_staff(self, email, password, **extra_data):
        extra_data.setdefault("is_staff", True)
        return self.create_user_with_email(email, password, **extra_data)

    def create_superuser(self, email, password, **extra_data):
        extra_data.setdefault("is_staff", True)
        extra_data.setdefault("is_superuser", True)
        return self.create_user_with_email(email, password, **extra_data)


def user_icon_path(instance, filename):
    return f'user_icons/{uuid_lib.uuid4()}.{filename.split(".")[-1]}'


def user_header_path(instance, filename):
    return f'user_headers/{uuid_lib.uuid4()}.{filename.split(".")[-1]}'


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField("uuid", default=uuid_lib.uuid4, primary_key=True, editable=False)

    username_validator = UsernameValidator()

    username = models.CharField(
        "Username",
        max_length=30,
        unique=True,
        help_text="ユーザー名は4~30文字の英数字と'_'が使用できます",
        validators=[username_validator, MinLengthValidator(4)],
        error_messages={
            "unique": "このユーザ名はすでに使用されています",
        },
    )

    display_name = models.CharField("表示名", max_length=50, default="")
    bio = models.TextField(max_length=160, blank=True)
    location = models.CharField(max_length=30, blank=True)
    website = models.URLField(max_length=100, blank=True)
    birth_date = models.DateField(blank=True, null=True)
    icon = models.FileField(upload_to=user_icon_path, blank=True, null=True)
    header = models.FileField(upload_to=user_header_path, blank=True, null=True)

    followees = models.ManyToManyField(
        "User",
        verbose_name="user",
        through="Friends",
        related_name="followers",
        through_fields=("follower", "followee"),
    )

    objects = UserManager()

    email = models.EmailField("Emailアドレス", blank=True)

    date_joined = models.DateTimeField("アカウント作成日", editable=False, auto_now=True)

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "email",
    ]

    is_staff = models.BooleanField(
        "スタッフ権限",
        default=False,
        help_text="管理サイトにログインできるかを指定します。",
    )
    is_active = models.BooleanField(
        "アクティブ",
        default=True,
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def save(self, **kwargs):
        if not self.display_name:
            self.display_name = self.username
        return super().save(**kwargs)


class Friends(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followee")
    followee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")

    followed_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Friend"
        verbose_name_plural = "Friends"
