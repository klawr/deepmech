
Pod::Spec.new do |s|
  s.name         = "RNNativePyTorch"
  s.version      = "1.0.0"
  s.summary      = "RNNativePyTorch"
  s.description  = <<-DESC
                  RNNativePyTorch
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNNativePyTorch.git", :tag => "master" }
  s.source_files  = "RNNativePyTorch/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  