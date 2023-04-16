from email.mime.text import MIMEText
import re
import smtplib
import config


def send_email(to, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['To'] = to
    msg['From'] = config.email_sender

    s = smtplib.SMTP(config.mail_server, config.mail_port)
    s.starttls()
    s.login(config.mail_user, config.mail_passwd)
    s.send_message(msg)
    s.quit()


def validate_email(email):
    # Regular expression pattern for validating email
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    # Matching the pattern with the email address
    match = re.match(pattern, email)
    # If the email matches the pattern, it is valid, else it is invalid
    if match:
        return True
    else:
        return False
