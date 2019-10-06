# texlive.profile by Kai Lawrence <mail@kailawrence.de>

# Reference: https://www.tug.org/texlive/doc/install-tl.html#PROFILES

# Reference: https://www.tug.org/texlive/doc/texlive-en/texlive-en.html#x1-250003.2.2

selected_scheme scheme-basic

# PATH OPTIONS

TEXDIR /opt/texlive
TEXMFCONFIG /opt/texmf-config
TEXMFVAR /opt/texmf-var
TEXMFHOME /opt/texmf
TEXMFLOCAL /opt/texlive/texmf-local
TEXMFSYSCONFIG /opt/texlive/texmf-config
TEXMFSYSVAR /opt/texlive/texmf-var

# INSTALLER OPTIONS
instopt_adjustpath 0
instopt_adjustrepo 1
instopt_letter 0
instopt_portable 1
instopt_write18_restricted 1

# TLPDB OPTIONS

tlpdbopt_autobackup 1
tlpdbopt_backupdir tlpkg/backups
tlpdbopt_create_formats 1
tlpdbopt_desktop_integration 0	
tlpdbopt_file_assocs 0
tlpdbopt_generate_updmap 0
tlpdbopt_install_docfiles 0
tlpdbopt_install_srcfiles 0
tlpdbopt_post_code 1
tlpdbopt_sys_bin /usr/local/bin
tlpdbopt_sys_info /usr/local/share/info
tlpdbopt_sys_man /usr/local/share/man
tlpdbopt_w32_multi_user 0

# COLLECTIONS

collection-basic 1
collection-bibtexextra 1
collection-binextra 1
collection-context 1
collection-fontutils 1
collection-formatsextra 1
collection-langenglish 1
collection-langgerman 1
collection-latex 1
collection-latexextra 1
collection-latexrecommended 1
collection-luatex 1
collection-mathscience 1
collection-metapost 1
collection-pictures 1
collection-plaingeneric 1
